package com.example.demo.service;

import com.example.demo.dto.Dtos.*;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Course;
import com.example.demo.model.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<CourseDto> searchPublic(String keyword, String category, String level) {
        return courseRepository.searchPublished(keyword, category, level)
            .stream().map(CourseDto::from).collect(Collectors.toList());
    }

    public CourseDto getPublicCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return CourseDto.from(course);
    }

    public List<CourseDto> getMyCourses(String email) {
        User user = getUser(email);
        return courseRepository.findByInstructor(user)
            .stream().map(CourseDto::from).collect(Collectors.toList());
    }

    @Transactional
    public CourseDto createCourse(CourseRequest req, String email) {
        User instructor = getUser(email);
        if (instructor.getRole() != User.Role.EDUCATOR && instructor.getRole() != User.Role.ADMIN)
            throw new AccessDeniedException("Only educators can create courses");
        Course course = Course.builder()
            .title(req.getTitle()).description(req.getDescription())
            .category(req.getCategory()).level(req.getLevel())
            .price(req.getPrice()).thumbnailUrl(req.getThumbnailUrl())
            .duration(req.getDuration())
            .status(req.getStatus() != null ? req.getStatus() : Course.Status.DRAFT)
            .instructor(instructor).build();
        return CourseDto.from(courseRepository.save(course));
    }

    @Transactional
    public CourseDto updateCourse(Long id, CourseRequest req, String email) {
        Course course = getCourseAndVerifyOwner(id, email);
        if (req.getTitle() != null) course.setTitle(req.getTitle());
        if (req.getDescription() != null) course.setDescription(req.getDescription());
        if (req.getCategory() != null) course.setCategory(req.getCategory());
        if (req.getLevel() != null) course.setLevel(req.getLevel());
        if (req.getPrice() != null) course.setPrice(req.getPrice());
        if (req.getThumbnailUrl() != null) course.setThumbnailUrl(req.getThumbnailUrl());
        if (req.getDuration() != null) course.setDuration(req.getDuration());
        if (req.getStatus() != null) course.setStatus(req.getStatus());
        return CourseDto.from(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(Long id, String email) {
        getCourseAndVerifyOwner(id, email);
        courseRepository.deleteById(id);
    }

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream().map(CourseDto::from).collect(Collectors.toList());
    }

    private Course getCourseAndVerifyOwner(Long id, String email) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if (!course.getInstructor().getEmail().equals(email))
            throw new AccessDeniedException("You don't own this course");
        return course;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
