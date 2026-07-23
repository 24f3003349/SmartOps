import pytest
from app.services.diff_metrics import calculate_diff_metrics

def test_identical_text_similarity():
    draft = "Thank you for reaching out. We are investigating your issue."
    final = "Thank you for reaching out. We are investigating your issue."
    
    metrics = calculate_diff_metrics(draft, final)
    assert metrics["similarity_score"] == 1.0
    assert metrics["edit_distance"] == 0
    assert metrics["human_modified"] is False

def test_minor_human_edits():
    draft = "Thank you for contacting us. We will reset your password shortly."
    final = "Thank you for contacting us. We have reset your password."
    
    metrics = calculate_diff_metrics(draft, final)
    assert 0.7 < metrics["similarity_score"] < 1.0
    assert metrics["edit_distance"] > 0
    assert metrics["human_modified"] is True

def test_complete_rewrite():
    draft = "Hi there, your ticket has been received."
    final = "Dear Valued Customer, regarding invoice #1042, refund has been processed."
    
    metrics = calculate_diff_metrics(draft, final)
    assert metrics["similarity_score"] < 0.5
    assert metrics["human_modified"] is True
