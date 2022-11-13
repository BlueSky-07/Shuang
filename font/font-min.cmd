@echo off
chcp 65001
set usefont=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZü
set first=%1
set second=%2
set first-=%first:~-0%
if "%first-%"=="-h" (
    echo "语法：min-font [-h|-H|-i|-I|输入的字体文件（记得后缀名）] [需要提取的字符（-i或-I时）|输出的字体文件名（输入字体文件时；记得后缀名）]"
    echo "-h：帮助"
    echo "-f：需要提取的字符"
    echo .
    echo "单独调用sfnttool.jar请键入“java -jar sfnttool.jar ...”"
    echo "以下是sfnttol.jar的帮助"
    java -jar sfnttool.jar -h
) else if "%first-%"=="-H" (
    echo "-h：帮助"
    echo "-f：需要提取的字符"
    echo .
    echo "单独调用sfnttool.jar请键入“java -jar sfnttool.jar ...”"
    echo "以下是sfnttol.jar的帮助"
    java -jar sfnttool.jar -h
) else if "%first-%"=="-i" (
    set usefont=%second%
    set first=
    set second=
    goto run
) else if "%first-%"=="-I" (
    set usefont=%second%
    set first=
    set second=
    goto run
) else (
    :run
    if not "%first%"=="" (
        set input="first"
    ) else (
        set /p input=输入字体：
    )
    if not "%second%"=="" (
        set output=%second%
    ) else (
        set /p output=输出字体：
    )
    java -jar sfnttool.jar -s %usefont% %input% %output%
)