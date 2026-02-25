package com.interviewprep.model;

public class InterviewQuestion {
    private Long id;
    private String category;
    private String question;
    private String answer;
    private int difficulty;

    public InterviewQuestion() {
    }

    public InterviewQuestion(Long id, String category, String question, String answer, int difficulty) {
        this.id = id;
        this.category = category;
        this.question = question;
        this.answer = answer;
        this.difficulty = difficulty;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public int getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }
}