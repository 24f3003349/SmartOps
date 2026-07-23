from difflib import SequenceMatcher

def calculate_diff_metrics(draft: str, final_response: str) -> dict:
    """
    Computes text similarity ratio and edit metrics comparing original AI draft 
    with the final human-approved response.
    """
    if not draft or not final_response:
        return {
            "similarity_score": 1.0 if draft == final_response else 0.0,
            "edit_distance": abs(len(draft or "") - len(final_response or "")),
            "human_modified": draft != final_response
        }

    matcher = SequenceMatcher(None, draft, final_response)
    similarity = round(matcher.ratio(), 4)
    
    # Calculate approximate edit operations distance
    opcodes = matcher.get_opcodes()
    edit_distance = sum(max(tag_end - tag_start, ref_end - ref_start) 
                        for tag, tag_start, tag_end, ref_start, ref_end in opcodes 
                        if tag != 'equal')
    
    human_modified = similarity < 0.99 or edit_distance > 0

    return {
        "similarity_score": float(similarity),
        "edit_distance": int(edit_distance),
        "human_modified": bool(human_modified)
    }
