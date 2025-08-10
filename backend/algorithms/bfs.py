from collections import deque, defaultdict
from data_structures.binary_tree_node import BinaryTreeNode as TreeNode



def levelOrder(root: TreeNode | None) -> list[list[int]]:
    if not root:
        return []
    queue, result = deque([root]), []
    while queue:
        level = [] 
        for _ in range(len(queue)):  # Process nodes at the current level
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result



def numIslands(grid: list[list[str]]) -> int:
    """
    Args:
        grid: `m x n` 2D grid of `1`s (land) and `0`s (water), assume all four edges of the grid are all surrounded by water.
    Returns:
        number of islands
    """
    if not grid or not grid[0]:
        return 0
    m, n = len(grid), len(grid[0])
    dirs = ((1,0),(-1,0),(0,1),(0,-1))
    islands = 0

    for i in range(m):
        for j in range(n):
            if grid[i][j] == "1":
                islands += 1
                grid[i][j] = "0" # mark as visited
                q = deque([(i, j)])
                while q:
                    r, c = q.popleft()
                    for dr, dc in dirs:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == "1":
                            grid[nr][nc] = "0" # mark as visited
                            q.append((nr, nc)) 
    return islands




def orangesRotting(grid: list[list[int]]) -> int:
    """
    Args:
        grid: `m x n` 2D grid of $0_{(empty)}$ , $1_{(fresh)}$ , $2_{(rotten)}$
    Returns:
        minutes required until no fresh oranges remain. If it's impossible, return -1.
    """

    m, n = len(grid), len(grid[0])
    q, fresh = deque(), 0
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 2:
                q.append((i, j))
            elif grid[i][j] == 1:
                fresh += 1
    if fresh == 0:
        return 0
    
    minutes = 0
    while q and fresh:
        minutes += 1
        for _ in range(len(q)):
            x, y = q.popleft()
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                    grid[nx][ny] = 2
                    fresh -= 1
                    q.append((nx, ny))
    
    return minutes if fresh == 0 else -1



class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def cloneGraph(node: Node | None) -> Node | None:
    """
    Args:
        node: reference to a node in a connected undirected graph
    Returns:
        deep copy of the graph
    """
    if not node:
        return None
    cloned = {node: Node(node.val)}
    queue = deque([node])
    while queue:
        cur = queue.popleft()
        for n in cur.neighbors:
            if n not in cloned:
                cloned[n] = Node(n.val)
                queue.append(n)
            cloned[cur].neighbors.append(cloned[n])
    return cloned[node] 





def snakesAndLadders(board: list[list[int]]) -> int:
    """
    Args:
        board: `n x n` 2D grid of `-1`s (normal squares) or [`1` , `n*n`] (snake/ladder)
    Returns:
        minimum number of moves to reach the final square `n*n`
    """

    flat_board =  [0] # Dummy 0 for 1-based indexing
    for r, row in enumerate(reversed(board)):
        flat_board.extend(row[::1 if r % 2 == 0 else -1])
        
    target =(n:= len(board)) * n 
    moves, queue =  {1: 0}, deque([1])

    while queue:
        current = queue.popleft()
        for roll in range(1, 7):
            nxt = current + roll
            if nxt > target:
                break
            landing = flat_board[nxt] if flat_board[nxt] != -1 else nxt
            if landing not in moves:
                moves[landing] = moves[current] + 1
                if landing == target:
                    return moves[landing]
                queue.append(landing)
    return -1


def updateMatrix(mat : list[list[int]]) -> list[list[int]]:

    m, n = len(mat), len(mat[0])
    dist = [[-1] * n for _ in range(m)]
    q = deque()
    # Initialize queue with all zero-cells
    for i in range(m):
        for j in range(n):
            if mat[i][j] == 0:
                dist[i][j] = 0
                q.append((i, j))
    
    while q:
        i, j = q.popleft()
        for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
            ni, nj = i + di, j + dj
            if 0 <= ni < m and 0 <= nj < n and dist[ni][nj] < 0:
                dist[ni][nj] = dist[i][j] + 1
                q.append((ni, nj))
    return dist



def shortestPath(grid: list[list[int]], k: int) -> int:
    """
    Args:
        grid: `m x n` 2D grid of `0`s (empty) and `1`s (obstacle)
        k: maximum number of eliminations allowed
    Returns:
        minimum number of steps to reach the bottom-right corner, or -1 if it's impossible

    Variables:
        - max_k:  max_k[r][c] = maximum eliminations remaining when visiting (r,c)
        - q: (row, col, steps, remaining_k)
        - min_steps:  Manhattan distance lower bound


    """
    
    rows, cols = len(grid), len(grid[0])
    min_steps = rows + cols - 3 
    if k >= min_steps:
        return min_steps
   
    max_k = [[-1] * cols for _ in range(rows)]
    max_k[0][0] = k

    
    q = deque([(0, 0, 0, k)])


    while q:
        r, c, steps, remaining_k = q.popleft()
        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_remaining_k = remaining_k - grid[nr][nc]
                if new_remaining_k > max_k[nr][nc]:
                    if (nr, nc) == (rows - 1, cols - 1):
                        return steps + 1
                    max_k[nr][nc] = new_remaining_k
                    q.append((nr, nc, steps + 1, new_remaining_k))
    return -1




def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:

    if endWord not in wordList:
        return 0

    L = len(beginWord)
    combos: dict[str, list[str]] = defaultdict(list)
    for w in wordList:
        for i in range(L):
            combos[w[:i] + "*" + w[i+1:]].append(w)

    front, back = {beginWord}, {endWord}
    dist_front, dist_back = {beginWord: 1}, {endWord: 1}

    while front and back:
        # expand smaller side to optimize
        if len(front) > len(back):
            front, back = back, front
            dist_front, dist_back = dist_back, dist_front

        next_front = set()
        for word in front:
            for i in range(L):
                for n in combos[word[:i] + "*" + word[i+1:]]: # Use pre-computed neighbors
                    if n in dist_back:
                        return dist_front[word] + dist_back[n]
                    if n not in dist_front:
                        dist_front[n] = dist_front[word] + 1
                        next_front.add(n)
        front = next_front

    return 0