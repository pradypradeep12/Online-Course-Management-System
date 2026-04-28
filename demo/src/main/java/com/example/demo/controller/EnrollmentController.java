package com.example.demo.controller;

import com.example.demo.dto.Dtos.*;
import com.example.demo.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentDto>> getMyEnrollments(Principal principal) {
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(principal.getName()));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentDto>> getCourseEnrollments(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId, principal.getName()));
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentDto> enroll(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.enroll(courseId, principal.getName()));
    }

    @PatchMapping("/{enrollmentId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentDto> updateProgress(@PathVariable Long enrollmentId,
            @Valid @RequestBody ProgressRequest req, Principal principal) {
        return ResponseEntity.ok(enrollmentService.updateProgress(enrollmentId, req, principal.getName()));
    }

    @DeleteMapping("/{enrollmentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<MessageResponse> unenroll(@PathVariable Long enrollmentId, Principal principal) {
        enrollmentService.unenroll(enrollmentId, principal.getName());
        return ResponseEntity.ok(new MessageResponse("Unenrolled successfully"));
    }
}
