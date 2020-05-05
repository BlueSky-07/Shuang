BUNDLE_FILE="src/app.js"

function append () {
  if test -f "src/$1"; then
    echo "appending src/$1"
    echo "/************************ $1 ************************/" >> "$BUNDLE_FILE"
    cat "src/$1" >> "$BUNDLE_FILE"
    echo "/******************** EOF $1 ************************/" >> "$BUNDLE_FILE"
  else
    echo "appending \"$1\""
    echo "/************************ - *************************/" >> "$BUNDLE_FILE"
    echo "$1" >> "$BUNDLE_FILE"
    echo "/******************** EOF - *************************/" >> "$BUNDLE_FILE"
  fi
  # echo -e "\n" >> "$BUNDLE_FILE"
}

echo "clearing $BUNDLE_FILE"
echo "" > "$BUNDLE_FILE"

append entry.js
append dict.js
append scheme-list.js
append mode-list.js
append core.js
append setting.js
append action.js
append "Shuang.app.action.init()"

echo "output > $BUNDLE_FILE"
