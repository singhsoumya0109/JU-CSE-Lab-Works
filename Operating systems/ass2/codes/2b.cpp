#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include <cstdlib>
#include <ctime>
#include <semaphore.h>
#include <fcntl.h>
using namespace std;
void childProcess(const string &name, sem_t *current, sem_t *waiting, int iterations)
{
    srand(time(0) + getpid());
    for (int i = 1; i <= iterations; i++)
    {
        sem_wait(current);
        cout << "Process " << name << " iteration " << i << endl;
        int sleepTime = rand() % 3 + 1;
        sleep(sleepTime);
        sem_post(waiting);
    }
}
int main()
{
    int iterations = 10;
    sem_t *semX = sem_open("/semX", O_CREAT, 0644, 0);
    sem_t *semY = sem_open("/semY", O_CREAT, 0644, 1);
    pid_t pidX = fork();
    if (pidX < 0)
    {
        cerr << "Failed to create process X." << endl;
        return 1;
    }
    else if (pidX == 0)
    {
        childProcess("X", semX, semY, iterations);
        sem_close(semX);
        sem_close(semY);
        return 0;
    } // Create two semaphores
    pid_t pidY = fork();
    if (pidY < 0)
    {
        cerr << "Failed to create process Y." << endl;
        return 1;
    }
    else if (pidY == 0)
    {
        childProcess("Y", semY, semX, iterations);
        sem_close(semX);
        sem_close(semY);
        return 0;
    }
    wait(NULL);
    wait(NULL);
    cout << "Both processes X and Y have completed." << endl;
    sem_unlink("/semX");
    sem_unlink("/semY");
    return 0;
}
