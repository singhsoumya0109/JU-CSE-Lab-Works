#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <map>
#include <set>

using namespace std;

// BFS function
vector<int> bfs(const map<int, vector<int>>& graph, int start, int destination) {
    set<int> visited;  // Set to keep track of visited nodes
    queue<pair<int, vector<int>>> q;  // Queue to store current node and the path
    visited.insert(start);
    q.push({start, {start}});  // Start BFS from the 'start' node
   
    while (!q.empty()) {
        auto [node, path] = q.front();
        q.pop();

        cout << "BFS Traversing Node: " << node << endl;  // Print the node being traversed

        if (node == destination) {
            return path;  // Return the path when destination is found
        }

        // Visit all neighbors of the current node
        for (int neighbor : graph.at(node)) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                vector<int> new_path = path;
                new_path.push_back(neighbor);
                q.push({neighbor, new_path});
            }
        }
    }
   
    return {};  // Return empty vector if no path found
}

// DFS function
vector<int> dfs(const map<int, vector<int>>& graph, int start, int destination) {
    set<int> visited;  // Set to keep track of visited nodes
    stack<pair<int, vector<int>>> s;  // Stack to store current node and the path
    visited.insert(start);
    s.push({start, {start}});  // Start DFS from the 'start' node
   
    while (!s.empty()) {
        auto [node, path] = s.top();
        s.pop();

        cout << "DFS Traversing Node: " << node << endl;  // Print the node being traversed

        if (node == destination) {
            return path;  // Return the path when destination is found
        }

        // Visit all neighbors of the current node
        for (int neighbor : graph.at(node)) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                vector<int> new_path = path;
                new_path.push_back(neighbor);
                s.push({neighbor, new_path});
            }
        }
    }
   
    return {};  // Return empty vector if no path found
}

int main() {
    // Graph represented as an adjacency list using map
    map<int, vector<int>> graph;
   
    // Example input: edges in the form of (u, v)
    // Add edges to the graph
    graph[1] = {2,5,8};
    graph[2] = {1,9};
    graph[3] = {8};
    graph[4] = {8};
    graph[5] = {1};
    graph[6] = {7,8, 10};
    graph[7] = {6};
    graph[8] = {1,3,4,6};
    graph[9] = {2};
    graph[10] = {6};
   
    for (auto it : graph) {
        cout << it.first << " connects ";
        for (auto it1 : it.second) {
            cout << it1 << " ";
        }
        cout << endl;
    }
   
    int start = 1;  // Starting node
    int destination = 3;  // Destination node
   
    // Perform BFS search
    vector<int> bfs_path = bfs(graph, start, destination);
    if (!bfs_path.empty()) {
        cout << "BFS Path: ";
        for (int node : bfs_path) {
            cout << node << " ";
        }
        cout << endl;
    } else {
        cout << "BFS: No path found" << endl;
    }
   
    // Perform DFS search
    vector<int> dfs_path = dfs(graph, start, destination);
    if (!dfs_path.empty()) {
        cout << "DFS Path: ";
        for (int node : dfs_path) {
            cout << node << " ";
        }
        cout << endl;
    } else {
        cout << "DFS: No path found" << endl;
    }
   
    return 0;
}

