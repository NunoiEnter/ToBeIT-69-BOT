section .data
msg     db "Hello, world", 0xA
len     equ $ - msg

section .text
global _start
_start:
    mov     rax, 1          ; syscall: write
    mov     rdi, 1          ; fd = stdout
    lea     rsi, [rel msg]  ; pointer to message
    mov     rdx, len        ; length
    syscall

    mov     rax, 60         ; syscall: exit
    xor     rdi, rdi
    syscall

