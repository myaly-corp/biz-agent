# Backend Architecture

The backend of the Skincare Routine Builder is built with FastAPI, a modern, high-performance web framework for building APIs with Python. This document outlines the key architectural components and patterns used in the backend.

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # Application entry point
│   ├── routers.py        # API route definitions
│   ├── models.py         # Pydantic models for request/response
│   ├── db_models.py      # SQLAlchemy ORM models
│   ├── database.py       # Database connection and session management
│   └── services/
│       └── document_service.py  # Document generation service
├── templates/            # Document templates
├── data/                 # Generated documents storage
└── requirements.txt      # Python dependencies
```

## API Endpoints

The backend exposes several RESTful API endpoints to handle form submission, document generation, and signature processing.

### Main Endpoints

1. **POST /api/form**: Submits form data and initiates document generation
2. **POST /api/signed**: Processes a signed document
3. **GET /api/job-status/{form_id}**: Retrieves the status of a document generation job

### API Security

All endpoints are protected with API key authentication:

```python
# API key verification middleware
async def verify_api_key(x_secret_key: str = Header(...)):
    if x_secret_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid or missing API key")
    return x_secret_key
```

## Form Submission Flow

When a form is submitted, the backend processes it asynchronously to avoid blocking the response:

```python
@router.post("/form", dependencies=[Depends(verify_api_key)])
async def submit_form(form_data: FormData, db: Session = Depends(get_db)):
    try:
        # Save form data to database with initial status
        form_data.status = JobStatus.CONTRACT_DRAFT_PENDING
        db_form = FormDataDB(**form_data.dict())
        db.add(db_form)
        db.commit()
        
        response = {
            "status": form_data.status,
            "form_id": form_id,
            "message": "Form submitted successfully"
        }

        # Process form asynchronously
        async def process_form_async():
            try:
                # Update status to processing
                db_form.status = JobStatus.CONTRACT_DRAFT_PROCESSING
                db.commit()
                
                # Generate documents
                _, document_paths = await document_service.process_form(form_data)
                
                # Construct the document URL
                document_url = f"/api/documents/{form_id}/{form_data.contract_type.value}_{form_id}_contract.pdf"
                
                # Update status and contract URL
                db_form.status = JobStatus.CONTRACT_DRAFT_COMPLETED
                db_form.draftContract = document_url
                db.commit()
                
                # Trigger external webhook
                await document_service.trigger_azure_flow(form_data)
                
            except Exception as e:
                # Handle errors
                db_form.status = JobStatus.CONTRACT_DRAFT_PENDING
                db_form.draftContract = None
                db.commit()

        # Start async processing
        import asyncio
        asyncio.create_task(process_form_async())
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=get_user_friendly_error(e))
```

## Document Generation

The document service handles the generation of personalized documents based on form data:

```python
async def process_form(form_data: FormData) -> Tuple[str, Dict[str, str]]:
    """
    Process form data to generate documents
    
    1. Create a unique ID for the form submission
    2. Create a directory for the documents
    3. Generate a DOCX document from template
    4. Replace placeholders with form data
    5. Convert DOCX to PDF
    6. Return the form ID and document paths
    """
    form_id = form_data.formId
    
    # Create directory for documents
    doc_dir = os.path.join(DOCUMENTS_DIR, form_id)
    os.makedirs(doc_dir, exist_ok=True)
    
    # Select template based on form data
    template_path = select_template(form_data)
    
    # Generate document from template
    doc_path = os.path.join(doc_dir, f"{form_data.contract_type.value}_{form_id}_contract.docx")
    generate_document(template_path, doc_path, form_data)
    
    # Convert to PDF
    pdf_path = os.path.join(doc_dir, f"{form_data.contract_type.value}_{form_id}_contract.pdf")
    convert_to_pdf(doc_path, pdf_path)
    
    return form_id, {
        "docx": doc_path,
        "pdf": pdf_path
    }
```

## Signature Processing

The backend also handles processing signatures and adding them to the generated documents:

```python
async def process_signature(form_data: FormData) -> str:
    """
    Process signature data and add it to the PDF
    
    1. Decode the signature data (base64)
    2. Create a signature image
    3. Add the signature to the PDF
    4. Return the path to the signed PDF
    """
    form_id = form_data.formId
    
    # Get paths to documents
    doc_dir = os.path.join(DOCUMENTS_DIR, form_id)
    pdf_path = os.path.join(doc_dir, f"{form_data.contract_type.value}_{form_id}_contract.pdf")
    signed_pdf_path = os.path.join(doc_dir, f"{form_data.contract_type.value}_{form_id}_signed_contract.pdf")
    
    # Process signature
    signature_data = form_data.signature
    signature_image_path = create_signature_image(signature_data, doc_dir)
    
    # Add signature to PDF
    add_signature_to_pdf(pdf_path, signed_pdf_path, signature_image_path, form_data.signature_position)
    
    return signed_pdf_path
```

## Database Models

The backend uses SQLAlchemy ORM for database operations:

```python
class FormDataDB(Base):
    __tablename__ = "form_data"
    
    id = Column(Integer, primary_key=True, index=True)
    formId = Column(String, unique=True, index=True)
    status = Column(String, nullable=True)
    draftContract = Column(String, nullable=True)
    signedContract = Column(String, nullable=True)
    
    # Form fields
    skinType = Column(String, nullable=True)
    skinGoals = Column(ARRAY(String), nullable=True)
    # Additional fields...
    
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## External Integrations

The backend integrates with external systems via webhooks:

```python
async def trigger_azure_flow(form_data: FormData) -> Dict[str, Any]:
    """
    Trigger an Azure Logic App flow with the form data
    """
    webhook_url = os.getenv("AZURE_WEBHOOK_URL")
    if not webhook_url:
        logger.warning("Azure webhook URL not configured, skipping webhook")
        return {"status": "skipped"}
    
    payload = {
        "form_id": form_data.formId,
        "form_data": form_data.dict(),
        "timestamp": datetime.utcnow().isoformat()
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(webhook_url, json=payload) as response:
            if response.status != 200:
                logger.error(f"Failed to trigger Azure flow: {await response.text()}")
                return {"status": "error", "code": response.status}
            
            return {"status": "success", "response": await response.json()}
```

## Error Handling

The backend includes comprehensive error handling to provide user-friendly error messages:

```python
def get_user_friendly_error(error: Exception) -> str:
    """
    Convert technical error messages to user-friendly messages
    """
    error_str = str(error).lower()
    if "docx2pdf" in error_str and "microsoft word" in error_str:
        return "Document conversion service is currently unavailable. Please try again later or contact support."
    return str(error)
```

## Docker Deployment

The backend is containerized using Docker for easy deployment:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Conclusion

The backend architecture of the Skincare Routine Builder is designed to be robust, scalable, and maintainable. By leveraging FastAPI's asynchronous capabilities and SQLite's simplicity, it provides a powerful backend for the multi-step form application while maintaining good performance and reliability. 