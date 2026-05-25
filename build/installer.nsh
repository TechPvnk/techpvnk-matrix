!macro customInstall
  Delete "$INSTDIR\TechPvnk Matrix.scr"
  Rename "$INSTDIR\TechPvnk Matrix.exe" "$INSTDIR\TechPvnk Matrix.scr"

  CreateDirectory "$SMPROGRAMS\TechPvnk Matrix"
  CreateShortcut "$SMPROGRAMS\TechPvnk Matrix\TechPvnk Matrix Screensaver.lnk" "$INSTDIR\TechPvnk Matrix.scr" "/s"
  CreateShortcut "$SMPROGRAMS\TechPvnk Matrix\Open Install Folder.lnk" "$WINDIR\explorer.exe" "$INSTDIR"
!macroend

!macro customUnInstall
  Delete "$SMPROGRAMS\TechPvnk Matrix\TechPvnk Matrix Screensaver.lnk"
  Delete "$SMPROGRAMS\TechPvnk Matrix\Open Install Folder.lnk"
  RMDir "$SMPROGRAMS\TechPvnk Matrix"
  Delete "$INSTDIR\TechPvnk Matrix.scr"
!macroend
