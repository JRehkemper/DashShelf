$bookmakrFile = "$env:USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\Bookmarks"
write-host($bookmakrFile)
$content = Get-Content -Path $bookmakrFile
write-host($content)
$pwd = Get-Location
$path = "$pwd\bookmarks.js"
if(Test-Path $path)
{
    Write-Host("Delete old File")
    Remove-Item "bookmarks.js"
}

Add-content "bookmarks.js" "var bookmarksFile = "
Add-Content "bookmarks.js" $content

Write-host("All Done")
Pause 