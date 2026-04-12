#!/usr/bin/env bash
set -e
cd /home/idirs/.openclaw/workspace/uyghur-daily-AI
node scripts/autopublish-post.js \
  --title "Google Gemma نېمە؟ ئاددىي چۈشەندۈرۈش" \
  --category "سۈنئىي ئەقىل" \
  --description "Google Gemma نىڭ نېمە ئىكەنلىكى، Gemini بىلەن پەرقى ۋە يەرلىك AI دا قانداق ئىشلىتىلىدىغانلىقىنى ئاددىي تىلدا چۈشەندۈرىدىغان ئۇيغۇرچە ماقالە." \
  --tags "Google Gemma,Gemma AI,سۈنئىي ئەقىل,ئۇيغۇرچە,Ollama,Google AI" \
  --featured-image "assets/img/default-cover.svg" \
  --content-file /home/idirs/.openclaw/workspace/uyghur-daily-AI/tmp-gemma-post.html
