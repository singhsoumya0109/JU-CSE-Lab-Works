// weather_broadcast.cpp
#include <iostream>
#include <unistd.h>
#include <cstring>
#include <cstdlib>
#define BUFFER_SIZE 256
void broadcaster(int pipe_fd)
{
    const char weather_info[] = "Sunny, 25°C";
    write(pipe_fd, weather_info, strlen(weather_info) + 1);
    close(pipe_fd);
}
void listener(int pipe_fd)
{
    char buffer[BUFFER_SIZE];
    read(pipe_fd, buffer, BUFFER_SIZE);
    std::cout << "Weather Info: " << buffer << std::endl;
    close(pipe_fd);
}
int main()
{
    int pipe_fd[2];
    int pid;
    if (pipe(pipe_fd) == -1)
    {
        perror("pipe");
        exit(EXIT_FAILURE);
    }
    pid = fork();
    if (pid == -1)
    {
        perror("fork");
        exit(EXIT_FAILURE);
    }
    if (pid == 0)
    {
        close(pipe_fd[1]);    // Close write end in child
        listener(pipe_fd[0]); // Child process as listener
    }
    else
    {
        close(pipe_fd[0]);       // Close read end in parent
        broadcaster(pipe_fd[1]); // Parent process as broadcaster
    }
    return 0;
}