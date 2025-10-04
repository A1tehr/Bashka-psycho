import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import List
import logging

logger = logging.getLogger(__name__)

async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    from_email: str = None,
    from_name: str = None
) -> bool:
    """Send a single email via SMTP"""
    try:
        # Get SMTP settings from environment
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', 465))
        smtp_username = os.environ.get('SMTP_USERNAME')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not all([smtp_host, smtp_username, smtp_password]):
            logger.warning("SMTP credentials not configured in .env file")
            return False
        
        if not from_email:
            from_email = os.environ.get('SMTP_FROM_EMAIL', smtp_username)
        if not from_name:
            from_name = os.environ.get('SMTP_FROM_NAME', 'Психологический центр развития')
        
        # Create message
        message = MIMEMultipart('alternative')
        message['Subject'] = subject
        message['From'] = f"{from_name} <{from_email}>"
        message['To'] = to_email
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html', 'utf-8')
        message.attach(html_part)
        
        # Send email via SSL
        await aiosmtplib.send(
            message,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_username,
            password=smtp_password,
            use_tls=True
        )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

async def send_bulk_email(
    recipients: List[str],
    subject: str,
    html_content: str
) -> dict:
    """Send email to multiple recipients"""
    results = {
        "total": len(recipients),
        "sent": 0,
        "failed": 0,
        "failed_emails": []
    }
    
    for email in recipients:
        success = await send_email(email, subject, html_content)
        if success:
            results["sent"] += 1
        else:
            results["failed"] += 1
            results["failed_emails"].append(email)
    
    return results
