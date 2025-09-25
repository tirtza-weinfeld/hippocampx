def most_points_solving_questions_with_brainpower(questions: list[list[int]]) -> int:
    """
    Intuition:
        Paradigm: This is a classic **Longest Path** problem on a Directed Acyclic Graph (DAG).
        Insight: The maximum score obtainable *from* any question `i` is a fixed value, regardless of past choices. This allows a backward pass from the end of the exam (where the future score is 0), calculating the optimal future score for each question by simply choosing the `max()` of two pre-computed paths: the one from "solving" vs. the one from "skipping".

    Time Complexity:
        O(n)
        where `n` is the number of questions.

    """


    memo, n = {}, len(questions)

    def dp(i):
        if i >= n:
            return 0

        if i not in memo:
            memo[i] = max(dp(i + 1), (q:=questions[i])[0] + dp(i + 1 + q[1]))
        return memo[i]

    return dp(0)
