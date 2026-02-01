def minAddToMakeValid(s: str) -> int:
    balance = insert = 0

    for p in s:
        if p == "(":
            balance += 1
        elif balance:
            balance -= 1
        else:
            insert += 1

    return insert + balance
