package com.example.demo.service;

import com.example.demo.dto.Dtos.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Course;
import com.example.demo.model.Lesson;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public List<LessonDto> getLessons(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndex(courseId)
            .stream().map(LessonDto::from).collect(Collectors.toList());
    }

    @Transactional
    public LessonDto createLesson(Long courseId, LessonRequest req, String email) {
        Course course = getCourseAndVerify(courseId, email);
        Lesson lesson = Lesson.builder()
            .title(req.getTitle()).content(req.getContent())
            .videoUrl(req.getVideoUrl()).orderIndex(req.getOrderIndex())
            .duration(req.getDuration()).course(course).build();
        return LessonDto.from(lessonRepository.save(lesson));
    }

    @Transactional
    public LessonDto updateLesson(Long courseId, Long lessonId, LessonRequest req, String email) {
        getCourseAndVerify(courseId, email);
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        if (req.getTitle() != null) lesson.setTitle(req.getTitle());
        if (req.getContent() != null) lesson.setContent(req.getContent());
        if (req.getVideoUrl() != null) lesson.setVideoUrl(req.getVideoUrl());
        if (req.getOrderIndex() != null) lesson.setOrderIndex(req.getOrderIndex());
        if (req.getDuration() != null) lesson.setDuration(req.getDuration());
        return LessonDto.from(lessonRepository.save(lesson));
    }

    @Transactional
    public void deleteLesson(Long courseId, Long lessonId, String email) {
        getCourseAndVerify(courseId, email);
        lessonRepository.deleteById(lessonId);
    }

    private Course getCourseAndVerify(Long courseId, String email) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if (!course.getInstructor().getEmail().equals(email))
            throw new AccessDeniedException("You don't own this course");
        return course;
    }
}
