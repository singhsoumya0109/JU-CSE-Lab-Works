// telephonic_conversation.cpp
#include <iostream>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <cstring>
#include <cstdlib>
#define FIFO_NAME "telephonic_fifo"
#define BUFFER_SIZE 256
void caller()
{
    int fd;
    const char message[] = "Hello, how are you?";
    fd = open(FIFO_NAME, O_WRONLY);
    write(fd, message, strlen(message) + 1);
    close(fd);
}
void receiver()
{
    int fd;
    char buffer[BUFFER_SIZE];
    fd = open(FIFO_NAME, O_RDONLY);
    read(fd, buffer, BUFFER_SIZE);
    std::cout << "Received: " << buffer << std::endl;
    close(fd);
}
int main()
{
    pid_t pid;
    mkfifo(FIFO_NAME, 0666);
    pid = fork();
    if (pid == -1)
    {
        perror("fork");
        exit(EXIT_FAILURE);
    }
    if (pid == 0)
    {
        receiver();
    }
    else
    {
        caller();
    }
    unlink(FIFO_NAME);
    return 0;
}