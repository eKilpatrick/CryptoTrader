import smtplib, ssl
import imaplib, email
from email.header import decode_header
import struct
import config

class Email:
    my_email = config.send_from
    password = config.pw
    smtp_url = config.smtp_url
    imap_url = config.imap_url
    port = config.port
    sendTo_email = config.send_to

    def __init__(self, par1, par2, par3):
        self.par1 = par1
        self.par2 = par2
        self.par3 = par3

    def SendEmail(self):
        self.message = "Subject: CryptoTrader ALERT\n\nCrypto: " + self.par1 + " is ready to be traded"

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(self.smtp_url, self.port, context=context) as server:
            server.login(self.my_email, self.password)
            server.sendmail(self.my_email, self.sendTo_email, self. message)

    def CheckEmail(self):
        try:
            self.con = imaplib.IMAP4_SSL(self.imap_url)
            self.con.login(self.my_email, self.password)
            status, messages = self.con.select('Inbox')
            
            messages = int(messages[0])
            
            for i in range(messages, 0, -1):
                res, msg = self.con.fetch(str(i), "(RFC822)")

                for response in msg:
                    if isinstance(response, tuple):
                        msg = email.message_from_bytes(response[1])
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding)
                        if subject.__contains__("CryptoTraderResponse"):
                            From, encoding = decode_header(msg.get("From"))[0]
                            if isinstance(From, bytes):
                                From = From.decode(encoding)
                            print("Subject: " + subject)
                            print("From: " + From)
                            content_type = msg.get_content_type()
                            if msg.is_multipart():
                                for part in msg.walk():
                                    content_type = part.get_content_type()
                                    content_disposition = str(part.get("Content-Disposition"))
                                    try:
                                        body = part.get_payload(decode=True).decode()
                                    except:
                                        pass                                    
                            else:
                                body = msg.get_payload(decode=True).decode()
                            print(body.strip())
        except:
            print('Error')