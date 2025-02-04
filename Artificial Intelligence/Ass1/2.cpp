#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> pi;

// Graph will store nodes as integers, but we will map characters to integers
vector<vector<pi>> graph;

// Function for adding directed edges to graph
void addedge(int x, int y, int cost) {
    graph[x].push_back(make_pair(cost, y));  // Only add the edge from x -> y (directed)
}

// Function to get the index of a node based on its character (A -> 0, B -> 1, ...)
int getIndex(char node) {
    return node - 'A';
}

// Function for implementing Best First Search
// Gives output path having lowest cost
void best_first_search(char actual_Src, char target, int n) {
    vector<bool> visited(n, false);
    vector<int> parent(n, -1);  // To track the parent of each node
    priority_queue<pi, vector<pi>, greater<pi>> pq;

    // Convert characters to their corresponding indices
    int start = getIndex(actual_Src);
    int targetIdx = getIndex(target);
   
    // Sorting in pq gets done by first value of pair (cost, node)
    pq.push(make_pair(0, start));
    visited[start] = true;

    cout << "Path: ";
   
    while (!pq.empty()) {
        int x = pq.top().second;
        // Displaying the node with the lowest cost
        cout << (char)(x + 'A') << " ";  // Convert index back to char
        pq.pop();

        if (x == targetIdx)
            break;

        // Traverse through neighbors
        for (int i = 0; i < graph[x].size(); i++) {
            if (!visited[graph[x][i].second]) {
                visited[graph[x][i].second] = true;
                parent[graph[x][i].second] = x;  // Track the parent node
                pq.push(make_pair(graph[x][i].first, graph[x][i].second));
            }
        }
    }

    // Now reconstruct the shortest path from target to source
    cout << "\nShortest Path: ";
    vector<char> shortestPath;
    int current = targetIdx;

    // Backtrack from the target node to the source node using the parent array
    while (current != -1) {
        shortestPath.push_back((char)(current + 'A'));  // Convert index back to char
        current = parent[current];
    }

    // Reverse the shortestPath to print from source to target
    reverse(shortestPath.begin(), shortestPath.end());

    // Print the shortest path
    for (char node : shortestPath) {
        cout << node << " ";
    }
    cout << endl;
}

// Driver code to test above methods
int main() {
    // No. of Nodes
    int v = 7;  // Example with 7 nodes (A to G)
    graph.resize(v);

    // Add directed edges using characters for readability (e.g., 'A', 'B', ...)
    // For example, A -> B with a cost of 3 will be: addedge(0, 1, 3);
    addedge(getIndex('A'), getIndex('B'), 5);
    addedge(getIndex('A'), getIndex('D'), 3);
    addedge(getIndex('B'), getIndex('C'), 1);
    addedge(getIndex('C'), getIndex('E'), 6);
    addedge(getIndex('C'), getIndex('G'), 8);
    addedge(getIndex('D'), getIndex('E'), 2);
    addedge(getIndex('D'), getIndex('F'), 2);
    addedge(getIndex('E'), getIndex('B'), 4);
    addedge(getIndex('F'), getIndex('G'), 3);
    addedge(getIndex('G'), getIndex('E'), 4);

    char source = 'A';
    char target = 'G';

    // Function call
    best_first_search(source, target, v);

    return 0;
}
