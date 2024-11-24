#include <iostream>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <cstdlib>
using namespace std;
sem_t resource;         // Semaphore for writer access
pthread_mutex_t rmutex; // Mutex for reader count
int read_count = 0;     // Number of active readers
void *reader(void *param)
{
    int id = *(int *)param;
    while (true)
    {
        pthread_mutex_lock(&rmutex);
        read_count++;
        if (read_count == 1)
        {
            sem_wait(&resource); // First reader locks resource
        }
        pthread_mutex_unlock(&rmutex);
        // Reading section
        cout << "Reader " << id << " is reading" << endl;
        sleep(rand() % 2); // Simulate read time
        pthread_mutex_lock(&rmutex);
        read_count--;
        if (read_count == 0)
        {
            sem_post(&resource); // Last reader unlocks resource
        }
        pthread_mutex_unlock(&rmutex);
        sleep(rand() % 3); // Simulate wait before trying to read again
    }
    pthread_exit(0);
}
void *writer(void *param)
{
    int id = *(int *)param;
    while (true)
    {
        sem_wait(&resource); // Wait until no readers are active
        // Writing section
        cout << "Writer " << id << " is writing" << endl;
        sleep(rand() % 2);   // Simulate write time
        sem_post(&resource); // Release access for readers and other writers
        sleep(rand() % 3);   // Simulate wait before trying to write again
    }
    pthread_exit(0);
}
int main()
{
    srand(time(nullptr));
    pthread_t readers[5], writer_thread;
    int reader_ids[5];
    // Initialize semaphores and mutex
    sem_init(&resource, 0, 1);
    pthread_mutex_init(&rmutex, nullptr);
    // Create reader threads
    for (int i = 0; i < 5; i++)
    {
        reader_ids[i] = i + 1;
        pthread_create(&readers[i], nullptr, reader, &reader_ids[i]);
    }
    // Create writer thread
    int writer_id = 1;
    pthread_create(&writer_thread, nullptr, writer, &writer_id);
    // Join threads (though with infinite loops, this will not terminate)
    pthread_join(writer_thread, nullptr);
    for (int i = 0; i < 5; i++)
    {
        pthread_join(readers[i], nullptr);
    }
    // Cleanup semaphores and mutex
    sem_destroy(&resource);
    pthread_mutex_destroy(&rmutex);
    return 0;
}