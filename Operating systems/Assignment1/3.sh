#!/bin/bash

# Function to count ordinary files in a directory and its sub-directories
count_files() {
  local dir="$1"
  
  # Find and count ordinary files (excluding directories)
  local file_count=$(find "$dir" -type f | wc -l)
  
  echo "Number of ordinary files in '$dir' and its sub-directories: $file_count"
}

# Function to count sub-directories
count_subdirectories() {
  local dir="$1"

  # Find and count sub-directories (excluding the current directory itself)
  local subdir_count=$(find "$dir" -type d | wc -l)
  
  echo "Number of sub-directories in '$dir': $((subdir_count - 1))"
}

# Get the current working directory
current_directory=$(pwd)

# Count the number of ordinary files
count_files "$current_directory"

# Count the number of sub-directories
count_subdirectories "$current_directory"
