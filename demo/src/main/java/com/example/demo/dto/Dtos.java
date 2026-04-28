package com.example.demo.dto;

import com.example.demo.model.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

public class Dtos {

    // Auth
    @Data public static class RegisterRequest {
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 6) private String password;
        @NotBlank private String name;
        @NotNull private User.Role role;
    }

    @Data public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }

    @Data @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private UserDto user;
    }

    // User
    @Data @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String email;
        private String name;
        private User.Role role;
        private LocalDateTime createdAt;

        public static UserDto from(User u) {
            return new UserDto(u.getId(), u.getEmail(), u.getName(), u.getRole(), u.getCreatedAt());
        }
    }

    // Course
    @Data public static class CourseRequest {
        @NotBlank private String title;
        private String description;
        private String category;
        private String level;
        private Double price;
        private String thumbnailUrl;
        private Integer duration;
        private Course.Status status;
    }

    @Data @AllArgsConstructor
    public static class CourseDto {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String level;
        private Double price;
        private String thumbnailUrl;
        private Integer duration;
        private Course.Status status;
        private UserDto instructor;
        private int lessonCount;
        private int enrollmentCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static CourseDto from(Course c) {
            return new CourseDto(
                c.getId(), c.getTitle(), c.getDescription(), c.getCategory(),
                c.getLevel(), c.getPrice(), c.getThumbnailUrl(), c.getDuration(),
                c.getStatus(), UserDto.from(c.getInstructor()),
                c.getLessons() != null ? c.getLessons().size() : 0,
                c.getEnrollments() != null ? c.getEnrollments().size() : 0,
                c.getCreatedAt(), c.getUpdatedAt()
            );
        }
    }

    // Lesson
    @Data public static class LessonRequest {
        @NotBlank private String title;
        private String content;
        private String videoUrl;
        private Integer orderIndex;
        private Integer duration;
    }

    @Data @AllArgsConstructor
    public static class LessonDto {
        private Long id;
        private String title;
        private String content;
        private String videoUrl;
        private Integer orderIndex;
        private Integer duration;
        private Long courseId;
        private LocalDateTime createdAt;

        public static LessonDto from(Lesson l) {
            return new LessonDto(l.getId(), l.getTitle(), l.getContent(), l.getVideoUrl(),
                l.getOrderIndex(), l.getDuration(), l.getCourse().getId(), l.getCreatedAt());
        }
    }

    // Enrollment
    @Data @AllArgsConstructor
    public static class EnrollmentDto {
        private Long id;
        private CourseDto course;
        private UserDto student;
        private Integer progress;
        private Enrollment.EnrollmentStatus status;
        private LocalDateTime enrolledAt;

        public static EnrollmentDto from(Enrollment e) {
            return new EnrollmentDto(e.getId(), CourseDto.from(e.getCourse()),
                UserDto.from(e.getStudent()), e.getProgress(), e.getStatus(), e.getEnrolledAt());
        }
    }

    @Data public static class ProgressRequest {
        @NotNull @Min(0) @Max(100) private Integer progress;
    }

    // Generic
    @Data @AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }

    @Data @AllArgsConstructor
    public static class ErrorResponse {
        private String error;
        private String message;
        private int status;
    }
}
