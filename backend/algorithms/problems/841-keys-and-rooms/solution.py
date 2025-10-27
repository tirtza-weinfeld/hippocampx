class Solution:
    def canVisitAllRooms(self, rooms: list[list[int]]) -> bool:
        """
        Intuition:
        Deep Dive:DFS reachability from room 0:
	    Goal: start from room 0 and reach every other room using the keys you find
	    Idea: DFS = “go as deep as possible before backtracking”
	        Each room is a node
	        Each key in that room is an edge to another node
	    Stack: we use a stack to track rooms we can explore next
	        Start with [0] (room 0 is unlocked)
	    Visited: mark rooms we’ve already opened so we don’t revisit them
	    Process:
	        Pop a room from the stack
	        For each key inside, if that room isn’t visited, mark it and push it on the stack
	    Finish: when the stack is empty, we’ve explored every reachable room
	    Check: if all rooms are visited → return True, else False

        Variables:
            seen : Track which rooms have been visited



        Expressions:
            'stack = [0]' : Start DFS from room 0
            'seen[0] = True' :Room 0 is unlocked by default
            'while stack' :  While there are rooms to explore
            'room = stack.pop()' :  Take the last added room (DFS = LIFO)
            'for key in rooms[room]' :  For each key found in this room
            'if not seen[key]' : If the room it unlocks isn't visited yet
            'stack.append(key)':  Push it onto the stack to explore later



        Time Complexity:
            O(n+E)


        """

        seen = [False] * len(rooms); stack = [0]
        seen[0] = True
        while stack:
            for key in rooms[stack.pop()]:
                if not seen[key]:
                    seen[key] = True
                    stack.append(key)
        return all(seen)
