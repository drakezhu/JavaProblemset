package com.interviewprep.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.model.InterviewQuestion;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewQuestionService {
    private List<InterviewQuestion> questions;

    public InterviewQuestionService() {
        loadQuestionsFromFile();
    }

    private void loadQuestionsFromFile() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ClassPathResource resource = new ClassPathResource("questions.json");
            InputStream inputStream = resource.getInputStream();
            questions = Arrays.asList(objectMapper.readValue(inputStream, InterviewQuestion[].class));
        } catch (IOException e) {
            throw new RuntimeException("Failed to load questions from file", e);
        }
    }

    public List<InterviewQuestion> getAllQuestions() {
        return questions;
    }

    public List<InterviewQuestion> getQuestionsByCategory(String category) {
        return questions.stream()
                .filter(q -> q.getCategory().equals(category))
                .collect(Collectors.toList());
    }

    public List<InterviewQuestion> getQuestionsByDifficulty(int difficulty) {
        return questions.stream()
                .filter(q -> q.getDifficulty() == difficulty)
                .collect(Collectors.toList());
    }

    public InterviewQuestion getQuestionById(Long id) {
        return questions.stream()
                .filter(q -> q.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public List<String> getAllCategories() {
        return questions.stream()
                .map(InterviewQuestion::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }
}