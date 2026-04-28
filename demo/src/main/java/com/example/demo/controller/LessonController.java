package com.example.demo.controller;

import com.example.demo.dto.Dtos.*;
import com.example.demo.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    public ResponseEntity<List<LessonDto>> getLessons(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessons(courseId));
    }

    @PostMapping
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> createLesson(@PathVariable Long courseId,
            @Valid @RequestBody LessonRequest req, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(lessonService.createLesson(courseId, req, principal.getName()));
    }

    @PutMapping("/{lessonId}")
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable Long courseId, @PathVariable Long lessonId,
            @RequestBody LessonRequest req, Principal principal) {
        return ResponseEntity.ok(lessonService.updateLesson(courseId, lessonId, req, principal.getName()));
    }

    @DeleteMapping("/{lessonId}")
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteLesson(@PathVariable Long courseId, @PathVariable Long lessonId,
            Principal principal) {
        lessonService.deleteLesson(courseId, lessonId, principal.getName());
        return ResponseEntity.ok(new MessageResponse("Lesson deleted"));
    }
}
