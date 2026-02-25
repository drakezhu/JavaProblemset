package com.interviewprep.controller;

import com.interviewprep.model.InterviewQuestion;
import com.interviewprep.service.InterviewQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5175")
public class InterviewQuestionController {

    @Autowired
    private InterviewQuestionService interviewQuestionService;

    @GetMapping("/api/questions")
    public List<InterviewQuestion> getAllQuestions() {
        return interviewQuestionService.getAllQuestions();
    }

    @GetMapping("/api/questions/category")
    public List<InterviewQuestion> getQuestionsByCategory(@RequestParam String category) {
        return interviewQuestionService.getQuestionsByCategory(category);
    }

    @GetMapping("/api/questions/difficulty")
    public List<InterviewQuestion> getQuestionsByDifficulty(@RequestParam int difficulty) {
        return interviewQuestionService.getQuestionsByDifficulty(difficulty);
    }

    @GetMapping("/api/question/{id}")
    public InterviewQuestion getQuestionById(@PathVariable Long id) {
        return interviewQuestionService.getQuestionById(id);
    }

    @GetMapping("/api/categories")
    public List<String> getAllCategories() {
        return interviewQuestionService.getAllCategories();
    }
}