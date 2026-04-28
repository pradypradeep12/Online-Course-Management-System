package com.example.demo.service;

import com.example.demo.dto.Dtos.*;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<EnrollmentDto> getMyEnrollments(String email) {
        User student = getUser(email);
        return enrollmentRepository.findByStudent(student)
            .stream().map(EnrollmentDto::from).collect(Collectors.toList());
    }

    public List<EnrollmentDto> getCourseEnrollments(Long courseId, String email) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if (!course.getInstructor().getEmail().equals(email))
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        return enrollmentRepository.findByCourseId(courseId)
            .stream().map(EnrollmentDto::from).collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentDto enroll(Long courseId, String email) {
        User student = getUser(email);
        if (student.getRole() != User.Role.STUDENT)
            throw new BadRequestException("Only students can enroll");
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if (course.getStatus() != Course.Status.PUBLISHED)
            throw new BadRequestException("Course is not available for enrollment");
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId))
            throw new BadRequestException("Already enrolled in this course");
        Enrollment enrollment = Enrollment.builder().student(student).course(course).build();
        return EnrollmentDto.from(enrollmentRepository.save(enrollment));
    }

    @Transactional
    public EnrollmentDto updateProgress(Long enrollmentId, ProgressRequest req, String email) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        if (!enrollment.getStudent().getEmail().equals(email))
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        enrollment.setProgress(req.getProgress());
        if (req.getProgress() >= 100) enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
        return EnrollmentDto.from(enrollmentRepository.save(enrollment));
    }

    @Transactional
    public void unenroll(Long enrollmentId, String email) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        if (!enrollment.getStudent().getEmail().equals(email))
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        enrollmentRepository.deleteById(enrollmentId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
