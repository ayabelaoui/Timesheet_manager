package com.employe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    public void sendTimesheetRejectionEmail(String toEmail, String employeeName, 
                                           String timesheetPeriod, String rejectionReason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@yourcompany.com");
        message.setTo(toEmail);
        message.setSubject("Timesheet Rejection Notification");
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Your timesheet for the period %s has been rejected.\n" +
            "Reason: %s\n\n" +
            "Please review and resubmit.\n\n" +
            "Best regards,\n" +
            "Your Company", employeeName, timesheetPeriod, rejectionReason);
            
        message.setText(emailBody);
        
        mailSender.send(message);
    }
}