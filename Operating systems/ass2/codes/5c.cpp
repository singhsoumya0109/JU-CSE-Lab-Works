// pesticide_broadcast.cpp
#include <iostream>
#include <cstring>
#include <sys/ipc.h>
#include <sys/msg.h>
#include <cstdlib>
#include <unistd.h>
#define MSG_KEY 1234
#define BUFFER_SIZE 256
struct Message
{
    long msg_type;
    char msg_text[BUFFER_SIZE];
};
void broadcaster()
{
    int msg_id = msgget(MSG_KEY, 0666 | IPC_CREAT);
    Message msg;
    msg.msg_type = 1;
    strcpy(msg.msg_text, "Pesticide Info: Use XYZ for best results.");
    msgsnd(msg_id, &msg, sizeof(msg), 0);
}
void listener()
{
    int msg_id = msgget(MSG_KEY, 0666 | IPC_CREAT);
    Message msg;
    msgrcv(msg_id, &msg, sizeof(msg), 1, 0);
    std::cout << "Broadcast: " << msg.msg_text << std::endl;
}
void query()
{
    int msg_id = msgget(MSG_KEY, 0666 | IPC_CREAT);
    Message msg;
    msg.msg_type = 2;
    strcpy(msg.msg_text, "Query: What is the price of XYZ?");
    msgsnd(msg_id, &msg, sizeof(msg), 0);
}
int main()
{
    pid_t pid = fork();
    if (pid == -1)
    {
        perror("fork");
        exit(EXIT_FAILURE);
    }
    if (pid == 0)
    {
        listener();
    }
    else
    {
        broadcaster();
        query();
    }
    return 0;
}