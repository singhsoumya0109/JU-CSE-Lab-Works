#include <bits/stdc++.h>
using namespace std;

// Define the graph as an adjacency list (directed graph)
vector<vector<int>> graph;

// Function to perform DFS with a depth limit
bool dfs(int node, int target, vector<bool>& visited, int depth, int maxDepth, vector<int>& path, vector<int>& searchSequence) {
    // If the depth exceeds the maximum depth, return false
    if (depth > maxDepth) {
        return false;
    }

    // Mark the node as visited and add it to the current path
    visited[node] = true;
    searchSequence.push_back(node);  // Add to the search sequence
    path.push_back(node);

    // If the target node is found, return true
    if (node == target) {
        return true;
    }

    // Explore all the neighbors
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            if (dfs(neighbor, target, visited, depth + 1, maxDepth, path, searchSequence)) {
                return true;
            }
        }
    }

    // Backtrack: remove the node from the path and search sequence
    path.pop_back();
    return false;
}

// Iterative Deepening Depth First Search (IDDFS)
bool iddfs(int start, int target, int n) {
    // Loop through increasing depth limits
    for (int depth = 0; depth < n; ++depth) {
        vector<bool> visited(n, false);  // Reset visited for each depth limit
        vector<int> path;  // To store the path from start to goal
        vector<int> searchSequence;  // To store the search sequence for each depth

        // Perform DFS for the current depth limit
        cout << "Depth " << depth << " Search Sequence: ";
        if (dfs(start, target, visited, 0, depth, path, searchSequence)) {
            // Print the search sequence for the current depth
            for (int node : searchSequence) {
                cout << (char)(node + 'A') << " ";  // Convert index to character (A, B, C, ...)
            }
            cout << endl;

            cout << "Path to target " << target << ": ";
            for (int node : path) {
                cout << (char)(node + 'A') << " ";  // Convert index to character (A, B, C, ...)
            }
            cout << endl;
            return true;
        } else {
            // Print the search sequence for this depth if the target is not found
            for (int node : searchSequence) {
                cout << (char)(node + 'A') << " ";  // Convert index to character (A, B, C, ...)
            }
            cout << "(Target not found at this depth)" << endl;
        }
    }

    cout << "Target node not found within the maximum depth limit!" << endl;
    return false;
}

// Driver code
int main() {
    int v = 14;  // Number of nodes (A to N), total 14 nodes
    graph.resize(v);

    // Add directed edges based on your description
    // A -> B, C
    graph[0].push_back(1);  // A -> B
    graph[0].push_back(2);  // A -> C

    // B -> D, E
    graph[1].push_back(3);  // B -> D
    graph[1].push_back(4);  // B -> E

    // D -> I, J
    graph[3].push_back(8);  // D -> I
    graph[3].push_back(9);  // D -> J

    // E -> K, L, M
    graph[4].push_back(10); // E -> K
    graph[4].push_back(11); // E -> L
    graph[4].push_back(12); // E -> M

    // C -> F, G, H
    graph[2].push_back(5);  // C -> F
    graph[2].push_back(6);  // C -> G
    graph[2].push_back(7);  // C -> H

    // F -> N
    graph[5].push_back(13); // F -> N

    // H -> O, P
    graph[7].push_back(14); // H -> O
    graph[7].push_back(15); // H -> P

    // Start and target nodes (A -> 0, G -> 6)
    char startNode = 'A';
    char targetNode = 'N';

    int start = startNode - 'A';  // Convert 'A' to index 0
    int target = targetNode - 'A'; // Convert 'G' to index 6

    // Call the Iterative Deepening DFS function
    iddfs(start, target, v);

    return 0;
}

