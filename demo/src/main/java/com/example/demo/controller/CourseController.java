package com.example.demo.controller;

import com.example.demo.dto.Dtos.*;
import com.example.demo.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // Public endpoints
    @GetMapping("/api/courses/public")
    public ResponseEntity<List<CourseDto>> searchPublic(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level) {
        return ResponseEntity.ok(courseService.searchPublic(keyword, category, level));
    }

    @GetMapping("/api/courses/public/{id}")
    public ResponseEntity<CourseDto> getPublicCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getPublicCourse(id));
    }

    // Protected endpoints
    @GetMapping("/api/courses/my")
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CourseDto>> getMyCourses(Principal principal) {
        return ResponseEntity.ok(courseService.getMyCourses(principal.getName()));
    }

    @GetMapping("/api/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PostMapping("/api/courses")
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<CourseDto> createCourse(@Valid @RequestBody CourseRequest req, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(req, principal.getName()));
    }

    @PutMapping("/api/courses/{id}")
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id, @RequestBody CourseRequest req, Principal principal) {
        return ResponseEntity.ok(courseService.updateCourse(id, req, principal.getName()));
    }

    @DeleteMapping("/api/courses/{id}")
    @PreAuthorize("hasRole('EDUCATOR') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteCourse(@PathVariable Long id, Principal principal) {
        courseService.deleteCourse(id, principal.getName());
        return ResponseEntity.ok(new MessageResponse("Course deleted successfully"));
    }
}
