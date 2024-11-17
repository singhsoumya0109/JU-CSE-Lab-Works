---
# Simple_CDMA

This project is a simulation of a basic **Code Division Multiple Access (CDMA)** system using Welsh codes for communication. Multiple stations communicate simultaneously by sending bits `1`, `0` (represented as `-1`), or nothing, and the channel content is computed based on the combined contributions of all stations.

## Features

- Simulates CDMA communication between multiple stations.
- Welsh codes are generated dynamically for each station.
- Each station randomly decides to send `1`, `0`, or remain idle in each iteration.
- Displays the channel content and what each station reads from the channel after every iteration.

## How It Works

1. **Welsh Code Generation**: 
   - Each station is assigned a unique Welsh code based on the number of stations.
   
2. **Simulation**: 
   - In each iteration, stations randomly send `1`, `0`, or nothing.
   - The channel content is calculated as the sum of the values sent by each station.
   - Each station attempts to decode the signal by reading the combined channel content.
--- 
