const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function generateIndicatorPdf() {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    autoFirstPage: false,
    info: {
      Title: 'From Trading Idea to MT5 Indicator',
      Author: 'AI-Assisted Trading Automation',
      Subject: 'A Practical, Step-by-Step Guide to Turning a Trading Idea Into Working MT5 Code Using AI',
      Keywords: 'MT5, MQL5, Indicator, ADR, Average Daily Range, ChatGPT, Claude, Algorithmic Trading',
      CreationDate: new Date('2026-09-18T00:00:00Z'),
    }
  });

  const outputPath = path.join(__dirname, '../public/downloads/From_Trading_Idea_to_MT5_Indicator_Guide.pdf');
  const distPath = path.join(__dirname, '../dist/downloads/From_Trading_Idea_to_MT5_Indicator_Guide.pdf');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(distPath), { recursive: true });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 54;
  const contentWidth = pageWidth - marginX * 2;

  function addHeaderFooter(pageNum) {
    // Header (all pages)
    doc.save();
    doc.font('Helvetica').fontSize(7.5).fillColor('#64748B');
    doc.text('AI-Assisted Trading Automation', marginX, 36, { lineBreak: false });
    doc.text('From Trading Idea to MT5 Indicator', pageWidth - marginX - 180, 36, { width: 180, align: 'right' });
    doc.restore();

    // Footer
    doc.save();
    doc.font('Helvetica').fontSize(8).fillColor('#64748B');
    doc.text(`${pageNum} / 17`, marginX, pageHeight - 36, {
      width: contentWidth,
      align: 'center'
    });
    doc.restore();
  }

  function drawHeading(title, yPos) {
    doc.save();
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#0F172A');
    doc.text(title, marginX, yPos);
    const barY = yPos + 18;
    doc.strokeColor('#0284C7').lineWidth(1.5).moveTo(marginX, barY).lineTo(pageWidth - marginX, barY).stroke();
    doc.restore();
    return barY + 14;
  }

  function drawCallout(label, body, yPos, height) {
    doc.save();
    doc.roundedRect(marginX, yPos, contentWidth, height, 3).fillAndStroke('#F0F9FF', '#BAE6FD');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#0369A1');
    doc.text(label, marginX + 10, yPos + 8);
    doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#1E293B');
    doc.text(body, marginX + 10, yPos + 22, { width: contentWidth - 20, lineGap: 2.5 });
    doc.restore();
    return yPos + height + 10;
  }

  // ==========================================
  // PAGE 1: COVER / TITLE
  // ==========================================
  doc.addPage();
  addHeaderFooter(1);

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0284C7');
  doc.text('AI-ASSISTED TRADING AUTOMATION', marginX, 90, { characterSpacing: 0.5 });

  doc.font('Helvetica-Bold').fontSize(24).fillColor('#0F172A');
  doc.text('From Trading Idea to MT5 Indicator', marginX, 114);

  doc.font('Helvetica-Oblique').fontSize(11).fillColor('#475569');
  doc.text('A Practical, Step-by-Step Guide to Turning a Trading Idea Into Working MT5 Code Using AI', marginX, 146, { width: contentWidth, lineGap: 3 });

  doc.strokeColor('#CBD5E1').lineWidth(0.5).moveTo(marginX, 195).lineTo(pageWidth - marginX, 195).stroke();


  // ==========================================
  // PAGE 2: INTRODUCTION & PART 1
  // ==========================================
  doc.addPage();
  addHeaderFooter(2);

  let curY = drawHeading('Introduction', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('You do not need to be a programmer to start automating your trading strategy.', marginX, curY);
  curY += 18;
  doc.text('The first step is not writing code. The first step is explaining what you want to build.', marginX, curY);
  curY += 20;

  doc.text('AI can help you take a simple trading idea and turn it into a clear specification that a coding AI can understand. The process is simple:', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 30;

  // Process flowchart
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0369A1');
  doc.text('IDEA  →  SPECIFICATION  →  CODING PROMPT  →  CODE  →  MT5  →  TEST  →  IMPROVE', marginX, curY, { width: contentWidth, align: 'center' });
  curY += 26;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('In this guide we use one worked example — an MT5 Average Daily Range (ADR) indicator — to demonstrate the full process from idea to finished tool.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 34;

  doc.text('The goal here is not to teach you how ADR works as a trading concept. The goal is to show you how to take an idea from your head and use AI to turn it into a working MT5 indicator — the same indicator shown running on a live chart in Figure 1 below.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 46;

  curY = drawHeading('Part 1 — Start With the Idea', curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text("When you have an idea for an indicator or Expert Advisor, don't start by thinking about programming. Start by asking:", marginX, curY, { width: contentWidth });
  curY += 26;

  doc.font('Helvetica-Oblique').fontSize(11).fillColor('#0284C7');
  doc.text('“What do I want this tool to do?”', marginX, curY, { width: contentWidth, align: 'center' });
  curY += 30;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text("You can explain your idea in normal language. You don't need to know MQL5. You don't need to know programming terminology. You simply describe what you want to see and how you want the tool to behave.", marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 40;

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0284C7');
  doc.text('Case Study: The ADR Indicator', marginX, curY);
  curY += 16;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Imagine you want an MT5 indicator that calculates ADR using a number of previous days and displays the expected levels on your chart. Instead of trying to write the code yourself, you start by giving ChatGPT a simple, rough request.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 42;

  curY = drawCallout(
    'STEP 1 — YOUR ROUGH IDEA (GIVEN TO CHATGPT)',
    'Create specifications for me to tell AI to build an MT5 ADR indicator that is based on X number of days. It\'s calculated from the opening price of the day to the high or low of the day, and it should draw dotted lines every day after market open, and when it\'s reached, it should give a notification, and it should also show the number of days used. I want a notification on screen when reached, and it should show the number of pips to reach the level. Make it clear and simple to understand.',
    curY,
    76
  );
  curY += 4;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text("That is enough to begin. You don't need to make the request perfect — you are simply giving AI your initial idea.", marginX, curY, { width: contentWidth });


  // ==========================================
  // PAGE 3: PARTS 2, 3, 4
  // ==========================================
  doc.addPage();
  addHeaderFooter(3);

  curY = drawHeading('Part 2 — Let ChatGPT Help Structure the Idea', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text("Now ChatGPT's job is to take your rough idea and turn it into a clearer specification. It can help identify things such as:", marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 26;

  ['What information the indicator needs from you.', 'What it should calculate.', 'What should appear on the chart.', 'What should happen when a level is reached.', 'What notifications are required.', 'What information should be displayed to you.'].forEach((b) => {
    doc.fillColor('#0284C7').text('•', marginX + 8, curY);
    doc.font('Helvetica').fillColor('#1E293B').text(b, marginX + 20, curY);
    curY += 16;
  });
  curY += 8;

  doc.text('This is where AI becomes your specification assistant. You are not asking it to decide your trading strategy — you are asking it to help you clearly describe your strategy or idea.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 42;

  curY = drawHeading('Part 3 — Review What AI Gives You', curY);

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0F172A');
  doc.text('This is one of the most important parts of the process. Do not automatically accept everything AI gives you.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 24;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Read through the specification carefully and ask yourself: “Is this actually what I want?”', marginX, curY, { width: contentWidth });
  curY += 20;

  doc.text("AI may misunderstand something. It may add something you don't want. It may leave something out. It may interpret your idea differently from how you intended. That is normal — your job is to review the specification.", marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 42;

  curY = drawHeading('Part 4 — Accept, Modify or Delete', curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('When reviewing the AI response, you have three simple choices:', marginX, curY);
  curY += 22;

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0F172A');
  doc.text('Accept', marginX, curY);
  curY += 14;
  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('If AI understood your idea correctly, keep it.', marginX, curY);
  curY += 24;

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0F172A');
  doc.text('Modify', marginX, curY);
  curY += 14;
  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('If something is almost correct but needs to change, tell AI what you want changed.', marginX, curY);
  curY += 20;

  curY = drawCallout('EXAMPLE — MODIFY', 'Change this part so that the indicator uses 10 previous completed days instead of 5.', curY, 38);
  curY += 6;

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0F172A');
  doc.text('Delete', marginX, curY);
  curY += 14;
  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text("If AI added something you don't want, remove it.", marginX, curY);
  curY += 20;

  curY = drawCallout('EXAMPLE — DELETE', '', curY, 26);


  // ==========================================
  // PAGE 4: PARTS 5, 6, 7
  // ==========================================
  doc.addPage();
  addHeaderFooter(4);

  curY = 65;
  // Continued callout top of page 4
  doc.save();
  doc.roundedRect(marginX, curY, contentWidth, 30, 3).fillAndStroke('#F0F9FF', '#BAE6FD');
  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#1E293B');
  doc.text("Remove the historical chart display. I only want the current day's levels.", marginX + 10, curY + 8, { width: contentWidth - 20 });
  doc.restore();
  curY += 42;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('You can continue doing this until the specification accurately represents your idea.', marginX, curY);
  curY += 30;

  curY = drawHeading('Part 5 — Finalize the Specification', curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Once you have reviewed everything, you should have a final specification. This becomes the blueprint for your indicator.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 26;

  doc.text('At this point, you should be able to read the specification and clearly understand:', marginX, curY);
  curY += 18;

  ['What the indicator does.', 'What information it uses.', 'What appears on the chart.', 'What happens when a level is reached.', 'What notifications are required.', 'What settings the user can control.'].forEach((b) => {
    doc.fillColor('#0284C7').text('•', marginX + 8, curY);
    doc.font('Helvetica').fillColor('#1E293B').text(b, marginX + 20, curY);
    curY += 16;
  });
  curY += 8;

  doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#1E293B');
  doc.text('This is an important milestone. You have gone from “I have an idea” to “I know exactly what I want the software to do.”', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 40;

  curY = drawHeading("Part 6 — Don't Ask Claude to Code Yet", curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Now we move to the next stage. Instead of taking your original rough request directly to a coding AI, use ChatGPT to prepare a proper coding prompt.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 28;

  curY = drawCallout(
    'EXAMPLE PROMPT TO CHATGPT',
    'Now take this finalized specification and create a detailed coding prompt for Claude to build this MT5 indicator in MQL5.',
    curY,
    44
  );
  curY += 6;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('ChatGPT can then turn your finalized specification into instructions specifically designed for the coding AI.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 38;

  curY = drawHeading('Part 7 — Review the Coding Prompt', curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Before sending the prompt to Claude, review it. Again, you are the person in control.', marginX, curY);
  curY += 18;

  ['Make sure the prompt accurately describes what you want.', 'If something is wrong, go back and change it.', 'If something is missing, add it.', 'If something unnecessary was added, remove it.'].forEach((b) => {
    doc.fillColor('#0284C7').text('•', marginX + 8, curY);
    doc.font('Helvetica').fillColor('#1E293B').text(b, marginX + 20, curY);
    curY += 16;
  });
  curY += 8;

  doc.text('Only when you are satisfied should you send the prompt to Claude.', marginX, curY);


  // ==========================================
  // PAGE 5: PARTS 8, 9 & FIGURE 1
  // ==========================================
  doc.addPage();
  addHeaderFooter(5);

  curY = drawHeading('Part 8 — Give the Prompt to Claude', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Now Claude becomes your coding assistant. Give Claude the finalized coding prompt, and Claude creates the MQL5 code required for the MT5 indicator. This is where the idea finally becomes actual software.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 30;

  doc.text('Notice the order: you did not start with code. You started with the trading idea. Then you created the specification. Then you created the coding instructions. Only then did you generate the code.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 30;

  doc.text('The complete MQL5 source Claude produced for this case study is included in full in Appendix A, and referenced again once the finished indicator is on the chart in Part 9.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 40;

  curY = drawHeading('Part 9 — Move the Code Into MT5', curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Once Claude gives you the MQL5 code, move it into MetaEditor. Create the appropriate MT5 indicator file, place the code inside it, then compile it.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 26;

  doc.text('At this stage, something important can happen: the code may compile successfully, or MetaEditor may show errors. Both situations are normal.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 26;

  doc.text('Figure 1 shows the finished indicator from this case study running live on an MT5 chart. Notice how every element traces directly back to the original rough idea from Part 1: the dotted ADR High/Low lines projected from the daily open, the “REACHED” status once a level is hit, and the live pips-remaining readout in the on-chart panel.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 44;

  // Figure 1 Box
  doc.save();
  doc.rect(marginX, curY, contentWidth, 140).fillAndStroke('#0A0F1D', '#334155');
  doc.font('Courier-Bold').fontSize(8.5).fillColor('#38BDF8');
  doc.text('MetaTrader 5 - [GOLD, H1] Live ADR Breakout Levels', marginX + 12, curY + 12);
  
  // Dashboard panel text
  doc.rect(marginX + 280, curY + 24, contentWidth - 292, 98).fillAndStroke('#0F172A', '#475569');
  doc.font('Courier-Bold').fontSize(8).fillColor('#FDE047');
  doc.text('SYSTEM DIAGNOSTICS & PARAMS', marginX + 288, curY + 30);
  doc.font('Courier').fontSize(7.5).fillColor('#94A3B8');
  doc.text('ADR (4-Day): 10166 pts\nATR(14): 1561 pts\nWeekly Range: 10172 pts\nBuffer: 712 | TP: 14442 | SL: 2407\nTrades Today - Buy: 0 | Sell: 1', marginX + 288, curY + 42, { lineGap: 2 });
  doc.font('Courier-Bold').fontSize(8).fillColor('#38BDF8');
  doc.text('ADR Upper | 6161.3 pips left', marginX + 288, curY + 92);

  // Price chart lines
  doc.font('Courier-Bold').fontSize(8).fillColor('#38BDF8');
  doc.text('· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ADR HIGH: 4425.30', marginX + 12, curY + 40);
  doc.font('Courier-Bold').fontSize(8).fillColor('#4ADE80');
  doc.text('ADR HIGH (+3821.5 PIPS - REACHED)', marginX + 60, curY + 68);
  doc.font('Courier-Bold').fontSize(8).fillColor('#94A3B8');
  doc.text('———————————————————————————— DAILY OPEN: 4294.55', marginX + 12, curY + 84);
  doc.font('Courier-Bold').fontSize(8).fillColor('#F87171');
  doc.text('· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ADR LOW: 4180.20', marginX + 12, curY + 112);
  doc.font('Courier').fontSize(7.5).fillColor('#4ADE80');
  doc.text('ADR LOW -5910.8 PIPS | 5499.0 PIPS REMAINING', marginX + 60, curY + 124);
  doc.restore();
  curY += 148;

  doc.font('Helvetica-Oblique').fontSize(8).fillColor('#64748B');
  doc.text('Figure 1 — The finished ADR indicator running on an MT5 chart, showing the daily-open reference line, the dotted ADR High/Low breakout levels, live REACHED status, and pips remaining to each level.', marginX, curY, { width: contentWidth, align: 'center', lineGap: 2 });


  // ==========================================
  // PAGE 6: PARTS 10 & 11
  // ==========================================
  doc.addPage();
  addHeaderFooter(6);

  curY = 65;
  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('The complete MQL5 code behind this exact behaviour is in Appendix A — “Complete MQL5 Source Code: ADR_Levels.mq5.”', marginX, curY, { width: contentWidth });
  curY += 30;

  curY = drawHeading("Part 10 — If There Are Errors, Don't Guess", curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text("If MetaEditor shows errors, don't try to randomly change the code yourself. Instead, copy the exact errors shown by MetaEditor and take them back to Claude.", marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 28;

  curY = drawCallout(
    'EXAMPLE — REPORTING AN ERROR',
    'MetaEditor produced the following errors. Please fix them and provide the complete corrected MQL5 code.\n[paste the exact compiler error text here]',
    curY,
    46
  );
  curY += 6;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Claude can use those errors to identify what needs to be corrected. After receiving the corrected code:', marginX, curY, { width: contentWidth });
  curY += 24;

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0369A1');
  doc.text('REPLACE THE OLD CODE  →  COMPILE AGAIN  →  CHECK THE RESULT', marginX, curY, { width: contentWidth, align: 'center' });
  curY += 26;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Repeat this process until the code compiles properly.', marginX, curY);
  curY += 34;

  curY = drawHeading('Part 11 — Compiling Is Not the End', curY);

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0F172A');
  doc.text('A very important lesson: a successful compilation does not automatically mean your strategy is correct.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 24;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('The code can compile without errors and still behave differently from what you intended. That is why you must test the indicator on an MT5 chart and ask:', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 26;

  ['Does it display what I requested?', 'Are the levels correct?', 'Are the notifications working?', 'Are the displayed values correct?', 'Does it behave correctly when a level is reached?', 'Does it reset correctly when required?', 'Does it match my original specification?'].forEach((b) => {
    doc.fillColor('#0284C7').text('•', marginX + 8, curY);
    doc.font('Helvetica').fillColor('#1E293B').text(b, marginX + 20, curY);
    curY += 16;
  });
  curY += 10;

  doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#1E293B');
  doc.text('You are testing the behaviour, not just the code.', marginX, curY);


  // ==========================================
  // PAGE 7: PART 12
  // ==========================================
  doc.addPage();
  addHeaderFooter(7);

  curY = drawHeading('Part 12 — Compare the Result With Your Original Idea', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Go back to your finalized specification and compare it with the actual indicator. This is where you become the tester.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 26;

  doc.text('If something is wrong, explain the problem to Claude.', marginX, curY);
  curY += 22;

  curY = drawCallout(
    'EXAMPLE — REPORTING A BEHAVIOUR ISSUE',
    'The indicator is working, but the notification is appearing multiple times. I only want one notification when the level is reached.',
    curY,
    46
  );
  curY += 10;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Claude can then modify the code. You compile again. You test again. This process continues until the software behaves the way you originally intended.', marginX, curY, { width: contentWidth, lineGap: 3 });


  // ==========================================
  // PAGE 8: WORKFLOW DIAGRAM
  // ==========================================
  doc.addPage();
  addHeaderFooter(8);

  curY = drawHeading('The Complete AI Automation Workflow', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('The complete process, from a bare idea to a validated tool, looks like this:', marginX, curY);
  curY += 26;

  const flowStepsP8 = [
    { num: '1. Idea', sub: 'You have a trading idea.' },
    { num: '2. ChatGPT', sub: 'Explain the idea in normal language.' },
    { num: '3. Brainstorm', sub: 'ChatGPT helps turn the idea into a structured specification.' },
    { num: '4. Review', sub: 'Read what AI created.' },
    { num: '5. Accept / Modify / Delete', sub: "Keep what is correct. Change what is wrong. Remove what you don't want." },
    { num: '6. Finalize', sub: 'Create the final specification.' },
    { num: '7. Coding Prompt', sub: 'Ask ChatGPT to turn the specification into a prompt for Claude.' },
    { num: '8. Review Prompt', sub: 'Make sure Claude will understand exactly what needs to be built.' },
    { num: '9. Claude', sub: 'Give the prompt to Claude.' },
    { num: '10. MQL5 Code', sub: 'Claude generates the code (see Appendix A).' },
    { num: '11. MT5 / MetaEditor', sub: 'Put the code into MetaEditor.' },
    { num: '12. Compile', sub: 'Check whether the code compiles.' },
    { num: '13. Debug', sub: 'If there are errors, send the exact errors back to Claude.' },
  ];

  flowStepsP8.forEach((s) => {
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0F172A');
    doc.text(s.num, marginX, curY, { width: contentWidth, align: 'center' });
    curY += 12;
    doc.font('Helvetica').fontSize(8.5).fillColor('#64748B');
    doc.text(s.sub, marginX, curY, { width: contentWidth, align: 'center' });
    curY += 14;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#0284C7');
    doc.text('↓', marginX, curY, { width: contentWidth, align: 'center' });
    curY += 14;
  });


  // ==========================================
  // PAGE 9: WORKFLOW DIAGRAM CONTINUED
  // ==========================================
  doc.addPage();
  addHeaderFooter(9);

  curY = 65;
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#0284C7');
  doc.text('↓', marginX, curY, { width: contentWidth, align: 'center' });
  curY += 16;

  const flowStepsP9 = [
    { num: '14. Test', sub: 'Run the indicator on MT5 (see Figure 1).' },
    { num: '15. Validate', sub: 'Compare the actual behaviour with your original specification.' },
    { num: '16. Improve', sub: 'Make changes where necessary.' }
  ];

  flowStepsP9.forEach((s, idx) => {
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0F172A');
    doc.text(s.num, marginX, curY, { width: contentWidth, align: 'center' });
    curY += 13;
    doc.font('Helvetica').fontSize(8.5).fillColor('#64748B');
    doc.text(s.sub, marginX, curY, { width: contentWidth, align: 'center' });
    curY += 16;
    if (idx < flowStepsP9.length - 1) {
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0284C7');
      doc.text('↓', marginX, curY, { width: contentWidth, align: 'center' });
      curY += 16;
    }
  });


  // ==========================================
  // PAGE 10: WHO DOES WHAT & MOST IMPORTANT PRINCIPLE
  // ==========================================
  doc.addPage();
  addHeaderFooter(10);

  curY = drawHeading('Who Does What?', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Understanding the roles makes this process much easier.', marginX, curY);
  curY += 22;

  // Table
  const roles = [
    {
      role: 'You — The Strategist',
      bullets: ['What the strategy does.', 'What the indicator or EA should do.', 'What rules should be followed.', 'What you want to see.', 'What should happen in different situations.', 'You are in control of the strategy.']
    },
    {
      role: 'ChatGPT — The\nSpecification Assistant',
      bullets: ['Explains your idea.', 'Organizes your thoughts.', 'Identifies missing details.', 'Creates a clear specification.', 'Turns the specification into a coding prompt.']
    },
    {
      role: 'Claude — The Coding\nAssistant',
      bullets: ['Converts the specification into MQL5.', 'Corrects coding errors.', 'Modifies the code.', 'Improves the implementation based on your instructions.']
    },
    {
      role: 'MT5 — The Testing\nEnvironment',
      bullets: ['Compiles the code.', 'Puts the tool on a chart.', 'Observes its behaviour.', 'Tests whether it works according to your specification.']
    }
  ];

  const col1W = 140;
  const col2W = contentWidth - col1W;

  roles.forEach((r) => {
    const rowH = Math.max(r.bullets.length * 15 + 14, 50);
    doc.save();
    doc.rect(marginX, curY, contentWidth, rowH).strokeColor('#CBD5E1').lineWidth(0.8).stroke();
    doc.rect(marginX, curY, col1W, rowH).fillAndStroke('#0284C7', '#0284C7');
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#FFFFFF');
    doc.text(r.role, marginX + 10, curY + 12, { width: col1W - 20 });

    let bY = curY + 10;
    r.bullets.forEach((b) => {
      doc.fillColor('#0284C7').text('•', marginX + col1W + 10, bY);
      doc.font('Helvetica').fontSize(8.5).fillColor('#1E293B').text(b, marginX + col1W + 20, bY, { width: col2W - 26 });
      bY += 15;
    });
    doc.restore();
    curY += rowH;
  });

  curY += 30;
  curY = drawHeading('The Most Important Principle', curY);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Do not think:', marginX, curY);
  curY += 18;

  doc.font('Helvetica-Oblique').fontSize(10.5).fillColor('#0284C7');
  doc.text('“I need to learn how to code before I can automate my strategy.”', marginX, curY, { width: contentWidth, align: 'center' });
  curY += 26;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('Instead, think:', marginX, curY);
  curY += 18;

  doc.font('Helvetica-BoldOblique').fontSize(10.5).fillColor('#0369A1');
  doc.text('“I need to learn how to clearly explain what I want to build.”', marginX, curY, { width: contentWidth, align: 'center' });
  curY += 28;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('AI can help with much of the technical work. But AI cannot replace your understanding of your own trading strategy. If you cannot clearly explain what your strategy should do, AI cannot magically know what you mean.', marginX, curY, { width: contentWidth, lineGap: 3 });


  // ==========================================
  // PAGE 11: THREE GOLDEN RULES
  // ==========================================
  doc.addPage();
  addHeaderFooter(11);

  curY = drawHeading('Three Golden Rules', 65);

  const goldenRules = [
    {
      title: 'Rule 1 — Idea First, Code Last',
      desc: "Never start by asking AI to write code when you haven't clearly defined what you want. Start with the idea. Turn the idea into a specification. Then create the code."
    },
    {
      title: "Rule 2 — Don't Blindly Trust AI",
      desc: 'AI can misunderstand you. AI can make assumptions. AI can add things you never requested. Always review the output. You are the decision-maker.'
    },
    {
      title: 'Rule 3 — Test the Behaviour',
      desc: 'A green compilation message is not proof that your strategy has been automated correctly. Always test the actual result against your original idea.'
    }
  ];

  goldenRules.forEach((r) => {
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#0284C7');
    doc.text(r.title, marginX, curY);
    curY += 16;
    doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
    doc.text(r.desc, marginX, curY, { width: contentWidth, lineGap: 3 });
    curY += 34;
  });


  // ==========================================
  // PAGE 12: FINAL FRAMEWORK
  // ==========================================
  doc.addPage();
  addHeaderFooter(12);

  curY = drawHeading('Final Framework', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('You can use this same process for almost any trading automation project:', marginX, curY);
  curY += 22;

  const frameSteps = [
    'Trading Idea',
    'ChatGPT',
    'Clear Specification',
    'Review / Modify / Delete',
    'Final Specification',
    'Coding Prompt',
    'Claude',
    'MQL5 Code',
    'MetaEditor',
    'Compile',
    'Debug',
    'Test',
    'Validate',
    'Improve'
  ];

  frameSteps.forEach((s, idx) => {
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0F172A');
    doc.text(s, marginX, curY, { width: contentWidth, align: 'center' });
    curY += 12;
    if (idx < frameSteps.length - 1) {
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0284C7');
      doc.text('↓', marginX, curY, { width: contentWidth, align: 'center' });
      curY += 12;
    }
  });
  curY += 16;

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('The ADR indicator in this case study is simply an example. The real skill you are learning is how to take a trading idea from your mind and systematically turn it into working software with the help of AI.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 34;

  doc.font('Helvetica-Bold').fontSize(11).fillColor('#0369A1');
  doc.text('Idea First. Specification Second. Code Last.', marginX, curY, { width: contentWidth, align: 'center' });


  // ==========================================
  // PAGE 13: APPENDIX A — SOURCE CODE (PART 1)
  // ==========================================
  doc.addPage();
  addHeaderFooter(13);

  curY = drawHeading('Appendix A — Complete MQL5 Source Code: ADR_Levels.mq5', 65);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
  doc.text('This is the finished MQL5 code Claude generated for the ADR indicator case study used throughout this guide. It implements every point from the finalized specification in Part 5:', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 28;

  [
    'An adjustable number of previous days (InpADRDays) used to calculate the ADR.',
    "ADR distances measured from each day's opening price to that day's high and low.",
    'Dotted High/Low lines projected from today\'s opening price, redrawn automatically at the start of each new trading day.',
    'An on-screen status panel showing the daily open, both ADR levels, and the live pips remaining to each level.',
    'A popup Alert(), an optional mobile push notification, and an optional sound the first time a level is reached.',
    'A REACHED status shown directly on the chart once a level is hit, matching Figure 1.'
  ].forEach((b) => {
    doc.fillColor('#0284C7').text('•', marginX + 8, curY);
    doc.font('Helvetica').fillColor('#1E293B').text(b, marginX + 20, curY, { width: contentWidth - 20, lineGap: 2 });
    curY += doc.heightOfString(b, { width: contentWidth - 20, lineGap: 2 }) + 4;
  });
  curY += 8;

  doc.text('To use it: open MetaEditor, create a new Custom Indicator called ADR_Levels, paste the code below over the template, then compile (F7) and drag the indicator onto a chart.', marginX, curY, { width: contentWidth, lineGap: 3 });
  curY += 28;

  // Code Block Box Page 13
  const codeP13 = `//+------------------------------------------------------------------+
//|                                                   ADR_Levels.mq5 |
//|                     Case Study: AI-Assisted Trading Automation   |
//|      Average Daily Range (ADR) breakout-level indicator for MT5   |
//+------------------------------------------------------------------+
#property copyright "Case Study - AI-Assisted Trading Automation"
#property link      ""
#property version   "1.00"
#property indicator_chart_window
#property indicator_plots 0

//--- Input parameters ------------------------------------------------
input group "ADR Settings"
input int    InpADRDays        = 4;     // Number of previous completed days used for ADR
input double InpBufferPoints   = 0;     // Extra buffer added to each level (points)
input bool   InpShowDailyOpen  = true;  // Draw a line at today's opening price

input group "Notifications"
input bool   InpAlertPopup     = true;  // Show a terminal Alert() popup
input bool   InpAlertPush      = false; // Send a push notification to mobile
input bool   InpAlertSound     = true;  // Play a sound when a level is reached
input string InpAlertSoundFile = "alert.wav";

input group "Appearance"
input color  InpColorHigh      = clrDeepSkyBlue;
input color  InpColorLow       = clrOrangeRed;
input color  InpColorOpen      = clrGray;
input color  InpColorHitHigh   = clrLime;
input color  InpColorHitLow    = clrRed;
input int    InpFontSize       = 9;
input int    InpLineWidth      = 1;

//--- Internal state ----------------------------------------------------
double   g_adrHighLevel = 0.0;
double   g_adrLowLevel  = 0.0;
double   g_todayOpen    = 0.0;
datetime g_todayStart   = 0;
bool     g_highReached  = false;
bool     g_lowReached   = false;
double   g_pointFactor  = 1.0;    // converts points -> "pips" on 5/3-digit brokers`;

  doc.save();
  doc.rect(marginX, curY, contentWidth, 310).fillAndStroke('#F8FAFC', '#CBD5E1');
  doc.font('Courier').fontSize(7.5).fillColor('#0F172A');
  doc.text(codeP13, marginX + 10, curY + 10, { lineGap: 1.5 });
  doc.restore();


  // ==========================================
  // PAGE 14: APPENDIX A — SOURCE CODE (PART 2)
  // ==========================================
  doc.addPage();
  addHeaderFooter(14);

  curY = 65;
  const codeP14 = `string   g_prefix;                // object-name prefix, keeps this indicator's objects unique

//+------------------------------------------------------------------+
int OnInit()
{
   g_prefix = "ADR_" + _Symbol + "_";

   // 5-digit / 3-digit brokers quote one extra decimal - 10 points = 1 pip
   g_pointFactor = (_Digits == 3 || _Digits == 5) ? 10.0 : 1.0;

   CalculateADR();
   DrawLevels();

   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   ObjectsDeleteAll(0, g_prefix);
   Comment("");
}

//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   datetime barDayStart = iTime(_Symbol, PERIOD_D1, 0);

   // A new trading day has started - recalculate ADR and redraw fresh lines
   if(barDayStart != g_todayStart)
   {
      g_todayStart  = barDayStart;
      g_highReached = false;
      g_lowReached  = false;
      CalculateADR();
      DrawLevels();
   }

   UpdateLiveInfo();

   return(rates_total);
}

//+------------------------------------------------------------------+
//| Average the previous N completed days' open-to-high and          |
//| open-to-low distances, then project them from today's open       |
//+------------------------------------------------------------------+
void CalculateADR()
{
   double sumUp = 0.0, sumDown = 0.0;
   int counted = 0;

   // Shift 1 = yesterday (last completed day) ... InpADRDays = oldest day used
   for(int i = 1; i <= InpADRDays; i++)
   {
      double dOpen = iOpen(_Symbol, PERIOD_D1, i);
      double dHigh = iHigh(_Symbol, PERIOD_D1, i);`;

  doc.save();
  doc.rect(marginX, curY, contentWidth, 700).fillAndStroke('#F8FAFC', '#CBD5E1');
  doc.font('Courier').fontSize(7.5).fillColor('#0F172A');
  doc.text(codeP14, marginX + 10, curY + 10, { lineGap: 1.5 });
  doc.restore();


  // ==========================================
  // PAGE 15: APPENDIX A — SOURCE CODE (PART 3)
  // ==========================================
  doc.addPage();
  addHeaderFooter(15);

  curY = 65;
  const codeP15 = `      double dLow  = iLow(_Symbol,  PERIOD_D1, i);

      if(dOpen == 0.0)
         continue; // not enough history yet

      sumUp   += (dHigh - dOpen);
      sumDown += (dOpen - dLow);
      counted++;
   }

   if(counted == 0)
   {
      Print("ADR_Levels: not enough daily history for ", InpADRDays, " days.");
      return;
   }

   double avgUp   = sumUp / counted;
   double avgDown = sumDown / counted;
   double buffer  = InpBufferPoints * _Point;

   g_todayOpen    = iOpen(_Symbol, PERIOD_D1, 0);
   g_adrHighLevel = g_todayOpen + avgUp   + buffer;
   g_adrLowLevel  = g_todayOpen - avgDown - buffer;
}

//+------------------------------------------------------------------+
//| Draw the daily-open, ADR-high and ADR-low lines as dotted rays   |
//| starting at market open and extending across the trading day     |
//+------------------------------------------------------------------+
void DrawLevels()
{
   datetime startTime = g_todayStart;
   datetime endTime   = startTime + PeriodSeconds(PERIOD_D1) * 2; // extend across the day

   DrawDottedLine(g_prefix + "High", startTime, endTime, g_adrHighLevel, InpColorHigh);
   DrawDottedLine(g_prefix + "Low",  startTime, endTime, g_adrLowLevel,  InpColorLow);

   if(InpShowDailyOpen)
      DrawDottedLine(g_prefix + "Open", startTime, endTime, g_todayOpen, InpColorOpen);

   UpdateLabel(g_prefix + "HighLabel", g_adrHighLevel, InpColorHigh,
      StringFormat("ADR HIGH (%d-day) %s", InpADRDays, DoubleToString(g_adrHighLevel, _Digits)));
   UpdateLabel(g_prefix + "LowLabel",  g_adrLowLevel,  InpColorLow,
      StringFormat("ADR LOW (%d-day) %s", InpADRDays, DoubleToString(g_adrLowLevel, _Digits)));
}

//+------------------------------------------------------------------+
void DrawDottedLine(string name, datetime t1, datetime t2, double price, color clr)
{
   if(ObjectFind(0, name) < 0)
      ObjectCreate(0, name, OBJ_TREND, 0, t1, price, t2, price);
   else
      ObjectMove(0, name, 0, t1, price);

   ObjectSetInteger(0, name, OBJPROP_TIME,  1, t2);
   ObjectSetDouble (0, name, OBJPROP_PRICE, 1, price);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_DOT);
   ObjectSetInteger(0, name, OBJPROP_WIDTH, InpLineWidth);
   ObjectSetInteger(0, name, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

//+------------------------------------------------------------------+
void UpdateLabel(string name, double price, color clr, string text)`;

  doc.save();
  doc.rect(marginX, curY, contentWidth, 700).fillAndStroke('#F8FAFC', '#CBD5E1');
  doc.font('Courier').fontSize(7.5).fillColor('#0F172A');
  doc.text(codeP15, marginX + 10, curY + 10, { lineGap: 1.5 });
  doc.restore();


  // ==========================================
  // PAGE 16: APPENDIX A — SOURCE CODE (PART 4)
  // ==========================================
  doc.addPage();
  addHeaderFooter(16);

  curY = 65;
  const codeP16 = `{
   if(ObjectFind(0, name) < 0)
      ObjectCreate(0, name, OBJ_TEXT, 0, TimeCurrent(), price);

   ObjectSetString (0, name, OBJPROP_TEXT, text);
   ObjectSetInteger(0, name, OBJPROP_TIME, TimeCurrent());
   ObjectSetDouble (0, name, OBJPROP_PRICE, price);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, InpFontSize);
   ObjectSetInteger(0, name, OBJPROP_ANCHOR, ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

//+------------------------------------------------------------------+
//| Runs on every tick: checks for level breaks and refreshes the    |
//| on-chart status panel with pips remaining to each level          |
//+------------------------------------------------------------------+
void UpdateLiveInfo()
{
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   double pipsToHigh = (g_adrHighLevel - bid) / _Point / g_pointFactor;
   double pipsToLow  = (bid - g_adrLowLevel)  / _Point / g_pointFactor;

   //--- breakout detection ------------------------------------------
   if(!g_highReached && bid >= g_adrHighLevel)
   {
      g_highReached = true;
      NotifyLevelReached("ADR HIGH", g_adrHighLevel);
      UpdateLabel(g_prefix + "HighLabel", g_adrHighLevel, InpColorHitHigh,
         StringFormat("ADR HIGH +%s pts — REACHED", DoubleToString((g_adrHighLevel - g_todayOpen) / _Point, 1)));
   }

   if(!g_lowReached && bid <= g_adrLowLevel)
   {
      g_lowReached = true;
      NotifyLevelReached("ADR LOW", g_adrLowLevel);
      UpdateLabel(g_prefix + "LowLabel", g_adrLowLevel, InpColorHitLow,
         StringFormat("ADR LOW -%s pts — REACHED", DoubleToString((g_todayOpen - g_adrLowLevel) / _Point, 1)));
   }

   //--- on-chart status panel ----------------------------------------
   string panel = StringFormat(
      "ADR (%d-Day) Indicator\\n" +
      "Daily Open : %s\\n" +
      "ADR High   : %s (%s)\\n" +
      "ADR Low    : %s (%s)\\n" +
      "Pips to High: %s\\n" +
      "Pips to Low : %s",
      InpADRDays,
      DoubleToString(g_todayOpen,    _Digits),
      DoubleToString(g_adrHighLevel, _Digits), (g_highReached ? "REACHED" : "pending"),
      DoubleToString(g_adrLowLevel,  _Digits), (g_lowReached  ? "REACHED" : "pending"),
      (g_highReached ? "-" : DoubleToString(MathMax(pipsToHigh, 0), 1)),
      (g_lowReached  ? "-" : DoubleToString(MathMax(pipsToLow,  0), 1))
   );

   Comment(panel);
}

//+------------------------------------------------------------------+
void NotifyLevelReached(string levelName, double levelPrice)
{
   string msg = StringFormat("%s: %s level reached at %s (%s)",`;

  doc.save();
  doc.rect(marginX, curY, contentWidth, 700).fillAndStroke('#F8FAFC', '#CBD5E1');
  doc.font('Courier').fontSize(7.5).fillColor('#0F172A');
  doc.text(codeP16, marginX + 10, curY + 10, { lineGap: 1.5 });
  doc.restore();


  // ==========================================
  // PAGE 17: APPENDIX A — SOURCE CODE (PART 5)
  // ==========================================
  doc.addPage();
  addHeaderFooter(17);

  curY = 65;
  const codeP17 = `      _Symbol, levelName,
      DoubleToString(levelPrice, _Digits),
      TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES));

   if(InpAlertPopup) Alert(msg);
   if(InpAlertPush)  SendNotification(msg);
   if(InpAlertSound) PlaySound(InpAlertSoundFile);

   Print(msg);
}
//+------------------------------------------------------------------+`;

  doc.save();
  doc.rect(marginX, curY, contentWidth, 130).fillAndStroke('#F8FAFC', '#CBD5E1');
  doc.font('Courier').fontSize(7.5).fillColor('#0F172A');
  doc.text(codeP17, marginX + 10, curY + 10, { lineGap: 1.5 });
  doc.restore();
  curY += 155;

  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor('#64748B');
  doc.text('Appendix A — ADR_Levels.mq5, the complete indicator source referenced in Part 8 and Part 9.', marginX, curY, { width: contentWidth, align: 'center' });

  // End Document
  doc.end();

  writeStream.on('finish', () => {
    fs.copyFileSync(outputPath, distPath);
    console.log(`Successfully generated complete 17-page indicator PDF at:\n${outputPath}\nFile size: ${fs.statSync(outputPath).size} bytes`);
  });
}

generateIndicatorPdf();
