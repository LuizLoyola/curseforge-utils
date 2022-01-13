# Compress all files inside src/

Remove-Item .\curseforge-utils.zip
Compress-Archive -Path src\* -Destination .\curseforge-utils.zip
