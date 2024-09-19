#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <dirent.h>

// Function prototypes
void parse_command(char *input, char **argv);
void execute_command(char **argv);

int main() {
    char input[1024];
    char *argv[100];
    
    while (1) {
        // Print prompt
        printf("1018-shell> ");
        
        // Read input
        if (fgets(input, sizeof(input), stdin) == NULL) {
            perror("fgets");
            exit(1);
        }
        
        // Remove trailing newline character
        input[strcspn(input, "\n")] = 0;
        
        // Parse the input into arguments
        parse_command(input, argv);
        
        // Execute the command
        execute_command(argv);
    }

    return 0;
}

void parse_command(char *input, char **argv) {
    char *token;
    int i = 0;
    
    token = strtok(input, " ");
    while (token != NULL) {
        argv[i++] = token;
        token = strtok(NULL, " ");
    }
    argv[i] = NULL; // Null-terminate the arguments list
}

void execute_command(char **argv) {
    if (argv[0] == NULL) {
        return; // No command entered
    }

    // Built-in commands
    if (strcmp(argv[0], "echo") == 0) {
        // Simple echo implementation
        for (int i = 1; argv[i] != NULL; i++) {
            printf("%s ", argv[i]);
        }
        printf("\n");
    } else if (strcmp(argv[0], "cd") == 0) {
        if (argv[1] == NULL) {
            fprintf(stderr, "cd: missing argument\n");
        } else if (chdir(argv[1]) != 0) {
            perror("cd");
        }
    } else if (strcmp(argv[0], "pwd") == 0) {
        char cwd[1024];
        if (getcwd(cwd, sizeof(cwd)) != NULL) {
            printf("%s\n", cwd);
        } else {
            perror("pwd");
        }
    } else if (strcmp(argv[0], "ls") == 0) {
        DIR *dir;
        struct dirent *entry;

        if ((dir = opendir(".")) == NULL) {
            perror("ls");
            return;
        }

        while ((entry = readdir(dir)) != NULL) {
            printf("%s\n", entry->d_name);
        }

        closedir(dir);
    } else {
        // External command execution
        pid_t pid = fork();
        if (pid == 0) {
            // Child process
            execvp(argv[0], argv);
            perror("execvp");
            exit(1);
        } else if (pid > 0) {
            // Parent process
            int status;
            waitpid(pid, &status, 0);
        } else {
            perror("fork");
        }
    }
}

