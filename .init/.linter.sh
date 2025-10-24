#!/bin/bash
cd /home/kavia/workspace/code-generation/sprint-planning-optimizer-23351-23360/sprint_planning_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

