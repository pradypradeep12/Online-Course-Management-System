package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User admin = userRepository.save(User.builder()
            .email("admin@demo.com").password(passwordEncoder.encode("admin123"))
            .name("Admin User").role(User.Role.ADMIN).build());

        User educator1 = userRepository.save(User.builder()
            .email("educator@demo.com").password(passwordEncoder.encode("edu123"))
            .name("Jane Smith").role(User.Role.EDUCATOR).build());

        User educator2 = userRepository.save(User.builder()
            .email("educator2@demo.com").password(passwordEncoder.encode("edu123"))
            .name("Bob Johnson").role(User.Role.EDUCATOR).build());

        userRepository.save(User.builder()
            .email("student@demo.com").password(passwordEncoder.encode("stu123"))
            .name("Alice Brown").role(User.Role.STUDENT).build());

        userRepository.save(User.builder()
            .email("student2@demo.com").password(passwordEncoder.encode("stu123"))
            .name("Charlie Davis").role(User.Role.STUDENT).build());

        Course c1 = courseRepository.save(Course.builder()
            .title("Complete React Development").description("Master React from basics to advanced patterns including hooks, context, and performance optimization.")
            .category("Web Development").level("Intermediate").price(49.99)
            .thumbnailUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400")
            .duration(1200).status(Course.Status.PUBLISHED).instructor(educator1).build());

        Course c2 = courseRepository.save(Course.builder()
            .title("Spring Boot Masterclass").description("Build production-ready REST APIs with Spring Boot, JPA, and Spring Security.")
            .category("Backend").level("Advanced").price(59.99)
            .thumbnailUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400")
            .duration(1800).status(Course.Status.PUBLISHED).instructor(educator1).build());

        Course c3 = courseRepository.save(Course.builder()
            .title("Python for Data Science").description("Learn Python programming and data analysis with Pandas, NumPy, and Matplotlib.")
            .category("Data Science").level("Beginner").price(39.99)
            .thumbnailUrl("https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400")
            .duration(900).status(Course.Status.PUBLISHED).instructor(educator2).build());

        courseRepository.save(Course.builder()
            .title("UI/UX Design Fundamentals").description("Learn design principles, wireframing, and prototyping with Figma.")
            .category("Design").level("Beginner").price(29.99)
            .thumbnailUrl("https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400")
            .duration(600).status(Course.Status.PUBLISHED).instructor(educator2).build());

        courseRepository.save(Course.builder()
            .title("Advanced TypeScript").description("Deep dive into TypeScript generics, decorators, and advanced type system features.")
            .category("Web Development").level("Advanced").price(44.99)
            .thumbnailUrl("https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400")
            .duration(800).status(Course.Status.DRAFT).instructor(educator1).build());

        lessonRepository.save(Lesson.builder().title("Introduction to React").content("React is a JavaScript library for building user interfaces...").orderIndex(1).duration(15).course(c1).build());
        lessonRepository.save(Lesson.builder().title("JSX and Components").content("JSX is a syntax extension for JavaScript...").orderIndex(2).duration(20).course(c1).build());
        lessonRepository.save(Lesson.builder().title("State and Props").content("State and props are core concepts in React...").orderIndex(3).duration(25).course(c1).build());
        lessonRepository.save(Lesson.builder().title("React Hooks").content("Hooks let you use state and other React features in function components...").orderIndex(4).duration(30).course(c1).build());

        lessonRepository.save(Lesson.builder().title("Spring Boot Setup").content("Setting up a Spring Boot project with Maven...").orderIndex(1).duration(20).course(c2).build());
        lessonRepository.save(Lesson.builder().title("REST Controllers").content("Building RESTful APIs with @RestController...").orderIndex(2).duration(25).course(c2).build());
        lessonRepository.save(Lesson.builder().title("JPA & Hibernate").content("Database integration with Spring Data JPA...").orderIndex(3).duration(30).course(c2).build());

        lessonRepository.save(Lesson.builder().title("Python Basics").content("Variables, data types, and control flow in Python...").orderIndex(1).duration(20).course(c3).build());
        lessonRepository.save(Lesson.builder().title("NumPy Arrays").content("Working with numerical data using NumPy...").orderIndex(2).duration(25).course(c3).build());
    }
}
