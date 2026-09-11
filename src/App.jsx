import React from "react";

import { useState, useEffect, useMemo, useCallback } from "react";

import {
  Home, Briefcase, FileText, Archive as ArchiveIcon, User, Plus, Search, LogOut,
  X, ChevronUp, ChevronDown, Upload, Download, Eye, Pencil,
  CheckCircle2, Circle, Clock, XCircle, SkipForward, ArrowLeft, RotateCcw,
  MapPin, Link2, Wallet, Menu, ChevronRight, Sun, Moon, ArrowUpRight
} from "lucide-react";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie
} from "recharts";

import { supabase } from "./lib/supabase";
import careerNestLogo from "./assets/careernest-logo.png";

/* ============================== TOKENS ============================== */
const THEME_CSS = `
  html,body,#root{min-height:100%;}
  html{overflow-y:auto;}
  body{margin:0;overflow-x:hidden;overflow-y:auto;}
  #root{width:100%;overflow:visible;}
  .cn-page-main{min-width:0;width:100%;min-height:100vh;overflow:visible;}
  .cn-root{
    --bg:#06111f;--surface:rgba(11,28,47,.82);--surface-2:#0e2238;--surface-3:#15314c;
    --border:rgba(84,197,255,.22);--border-soft:rgba(220,239,255,.10);
    --gold:#f4c95d;--gold-soft:rgba(244,201,93,.13);--gold-deep:#d99f2f;
    --text:#f7fbff;--text-muted:#b9cada;--text-faint:#8196ad;
    --teal:#46dbc2;--sage:#69df83;--clay:#ff9f6e;--blue:#68a9ff;--red:#ff737d;--grey:#a7b7c8;
    font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    background:
      radial-gradient(900px 500px at -5% -5%,rgba(36,126,255,.25),transparent 60%),
      radial-gradient(760px 500px at 105% 0%,rgba(32,205,166,.17),transparent 58%),
      radial-gradient(800px 500px at 50% 110%,rgba(245,194,81,.08),transparent 62%),#06111f;
    color:var(--text);min-height:100vh;transition:background .4s ease,color .3s ease;position:relative;overflow-x:hidden;overflow-y:visible;
  }
  .cn-root.light{
    --bg:#f4faf8;--surface:rgba(255,255,255,.82);--surface-2:#f8fcfb;--surface-3:#edf7f4;
    --border:rgba(16,129,116,.18);--border-soft:rgba(20,55,72,.09);
    --gold:#0b8277;--gold-soft:rgba(11,130,119,.10);--gold-deep:#0f9e91;
    --text:#13263d;--text-muted:#587087;--text-faint:#8aa0b4;
    --teal:#0b8277;--sage:#199650;--clay:#d96826;--blue:#2563eb;--red:#d93645;--grey:#657990;
    background:
      radial-gradient(900px 560px at -5% -8%,rgba(91,186,255,.20),transparent 60%),
      radial-gradient(820px 540px at 105% 0%,rgba(91,222,165,.18),transparent 58%),
      radial-gradient(850px 500px at 50% 110%,rgba(246,201,93,.11),transparent 62%),#f4faf8;
  }
  .cn-root::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.42;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(to bottom,black,transparent 85%)}
  .cn-root.light::before{opacity:.28;background-image:linear-gradient(rgba(18,72,82,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(18,72,82,.035) 1px,transparent 1px)}
  .cn-root>*{position:relative;z-index:1}
  .cn-serif{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.045em;font-weight:800}
  .cn-card{background:var(--surface);border:1px solid var(--border-soft);border-radius:18px;box-shadow:0 18px 50px rgba(2,16,30,.14),0 2px 10px rgba(2,16,30,.05);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:transform .22s ease,box-shadow .25s ease,border-color .22s ease,background .25s ease}
  .cn-card:hover{transform:translateY(-3px);border-color:var(--border);box-shadow:0 24px 60px rgba(2,16,30,.18),0 4px 14px rgba(2,16,30,.06)}
  .cn-root.light .cn-card{box-shadow:0 18px 45px rgba(35,91,100,.09),0 2px 10px rgba(35,91,100,.04)}
  .cn-root.light .cn-card:hover{box-shadow:0 24px 58px rgba(35,91,100,.13),0 5px 14px rgba(35,91,100,.05)}
  .cn-sidebar{background:linear-gradient(180deg,rgba(5,17,30,.94),rgba(7,25,42,.84));backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:14px 0 45px rgba(0,0,0,.12)}
  .cn-root.light .cn-sidebar{background:linear-gradient(180deg,rgba(255,255,255,.91),rgba(244,250,248,.84));box-shadow:14px 0 45px rgba(33,89,98,.06)}
  .cn-input{width:100%;background:var(--surface-2);border:1px solid var(--border-soft);border-radius:13px;padding:11px 13px;color:var(--text);font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s,background .2s;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
  .cn-input:hover{border-color:var(--border)}.cn-input:focus{border-color:var(--gold);box-shadow:0 0 0 4px var(--gold-soft)}.cn-input::placeholder{color:var(--text-faint);opacity:.9}
  .cn-label{font-size:12px;color:var(--text-muted);margin-bottom:6px;display:block;font-weight:700;letter-spacing:.01em}
  .cn-btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-deep));color:#fff;font-weight:800;border:none;border-radius:13px;padding:10px 16px;font-size:13.5px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 10px 28px var(--gold-soft);transition:transform .18s,box-shadow .18s,filter .18s,opacity .18s}
  .cn-btn-gold:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 15px 34px var(--gold-soft)}.cn-btn-gold:active{transform:translateY(1px)}.cn-btn-gold:disabled{cursor:not-allowed;opacity:.55;transform:none}
  .cn-btn-ghost{background:var(--surface);color:var(--text-muted);border:1px solid var(--border-soft);border-radius:13px;padding:9px 14px;font-size:13.5px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:transform .18s,background .18s,border-color .18s,color .18s,box-shadow .18s}
  .cn-btn-ghost:hover{transform:translateY(-1px);color:var(--text);border-color:var(--border);background:var(--gold-soft);box-shadow:0 8px 24px rgba(7,19,33,.08)}
  .cn-nav-item{display:flex;align-items:center;gap:12px;padding:12px 13px;border-radius:13px;color:var(--text-muted);font-size:14px;cursor:pointer;border:1px solid transparent;transition:transform .18s,background .18s,color .18s,border-color .18s;position:relative;overflow:hidden}
  .cn-nav-item::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.05),transparent);opacity:0;transition:opacity .2s}.cn-nav-item:hover::after,.cn-nav-item.active::after{opacity:1}
  .cn-nav-item:hover{background:var(--surface-2);color:var(--text);border-color:var(--border-soft);transform:translateX(3px)}
  .cn-nav-item.active{background:linear-gradient(100deg,var(--gold-soft),rgba(37,99,235,.04));color:var(--gold);border-color:var(--border);font-weight:800;box-shadow:inset 3px 0 0 var(--gold),0 8px 24px rgba(7,19,33,.08)}
  .cn-root.light .cn-nav-item.active{background:linear-gradient(100deg,rgba(11,130,119,.13),rgba(37,99,235,.045));box-shadow:inset 3px 0 0 var(--gold),0 10px 26px rgba(11,130,119,.07)}
  .cn-root:not(.light){--text-muted:#c4d2e1;--text-faint:#91a7bc}.cn-root:not(.light) .text-gray-300,.cn-root:not(.light) .text-gray-400,.cn-root:not(.light) .text-gray-500{color:var(--text-muted)!important}
  .cn-bottomnav{backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);background:rgba(5,17,30,.94)!important;box-shadow:0 -12px 35px rgba(0,0,0,.14)}.cn-root.light .cn-bottomnav{background:rgba(255,255,255,.94)!important;box-shadow:0 -12px 35px rgba(33,89,98,.08)}
  .cn-root .fixed.z-50>.cn-card{box-shadow:0 35px 90px rgba(0,0,0,.34)}.cn-root ::selection{background:var(--gold);color:#fff}.cn-root button:focus-visible,.cn-root input:focus-visible,.cn-root select:focus-visible,.cn-root textarea:focus-visible,.cn-root a:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
  .cn-logo-shell{position:relative;display:flex;align-items:center;justify-content:center;width:240px;height:205px;padding:0;overflow:visible;isolation:isolate}.cn-logo-shell img{position:relative;z-index:3;width:236px;height:auto;object-fit:contain;filter:drop-shadow(0 8px 14px rgba(0,0,0,.14))}.cn-root.light .cn-logo-shell img{filter:drop-shadow(0 7px 12px rgba(34,93,91,.10))}
  .cn-sidebar{position:relative;overflow:hidden}.cn-sidebar-art{position:absolute;left:-8px;right:-8px;bottom:0;height:260px;pointer-events:none;z-index:0;overflow:hidden}.cn-sidebar-art::before{content:"";position:absolute;left:-22%;bottom:-62px;width:145%;height:142px;border-radius:50%;border-top:2px solid rgba(38,190,198,.34);background:linear-gradient(165deg,rgba(8,64,83,.58),rgba(7,39,57,.08));transform:rotate(-5deg)}.cn-sidebar-art::after{content:"";position:absolute;left:-18%;bottom:-92px;width:142%;height:142px;border-radius:50%;border-top:1.5px solid rgba(54,198,194,.22);background:transparent;transform:rotate(-7deg)}.cn-sidebar-art .wave{position:absolute;left:-24%;right:24%;bottom:52px;height:78px;border-radius:50%;border-top:2px solid rgba(44,192,196,.28);transform:rotate(-9deg)}.cn-sidebar-art .wave-2{position:absolute;left:-18%;right:4%;bottom:20px;height:68px;border-radius:50%;border-top:1px solid rgba(54,198,194,.20);transform:rotate(-8deg)}.cn-sidebar-art .stem{position:absolute;right:48px;bottom:-28px;width:5px;height:205px;border-radius:50%;background:linear-gradient(to top,rgba(37,114,89,.08),rgba(63,190,125,.78));transform:rotate(23deg);transform-origin:bottom;box-shadow:0 0 14px rgba(49,170,119,.10)}.cn-sidebar-art .leaf-a,.cn-sidebar-art .leaf-b,.cn-sidebar-art .leaf-c,.cn-sidebar-art .leaf-d{position:absolute;border-radius:100% 0 100% 0;background:linear-gradient(145deg,rgba(102,220,145,.92),rgba(25,123,92,.48));box-shadow:0 8px 20px rgba(25,123,94,.13)}.cn-sidebar-art .leaf-a{right:4px;bottom:96px;width:50px;height:126px;transform:rotate(32deg)}.cn-sidebar-art .leaf-b{right:68px;bottom:47px;width:38px;height:96px;transform:rotate(-27deg) scale(.92)}.cn-sidebar-art .leaf-c{right:84px;bottom:128px;width:30px;height:73px;transform:rotate(-47deg) scale(.82);opacity:.88}.cn-sidebar-art .leaf-d{right:126px;bottom:18px;width:31px;height:70px;transform:rotate(-76deg) scale(.72);opacity:.78}.cn-root.light .cn-sidebar-art::before{background:linear-gradient(165deg,rgba(35,139,130,.08),rgba(45,145,133,.018));border-top-color:rgba(24,143,132,.14)}.cn-root.light .cn-sidebar-art::after{border-top-color:rgba(24,143,132,.10)}.cn-root.light .cn-sidebar-art .wave,.cn-root.light .cn-sidebar-art .wave-2{border-top-color:rgba(34,151,142,.13)}.cn-root.light .cn-sidebar-art .stem{background:linear-gradient(to top,rgba(63,159,119,.03),rgba(63,159,119,.30));box-shadow:none}.cn-root.light .cn-sidebar-art .leaf-a,.cn-root.light .cn-sidebar-art .leaf-b,.cn-root.light .cn-sidebar-art .leaf-c,.cn-root.light .cn-sidebar-art .leaf-d{background:linear-gradient(145deg,rgba(92,190,137,.34),rgba(50,140,112,.08));box-shadow:none}
  .cn-brand-logo{width:178px;height:auto;display:block;object-fit:contain}.cn-mobile-logo{width:145px;height:auto;display:block;object-fit:contain}.cn-loading-logo{width:210px;max-width:65vw;height:auto;display:block;object-fit:contain}
  .cn-sidebar-journey{position:relative;overflow:hidden;border:1px solid rgba(76,201,226,.14);border-radius:22px;background:linear-gradient(145deg,rgba(12,42,60,.74),rgba(7,29,45,.54));box-shadow:0 16px 34px rgba(0,0,0,.12),inset 0 1px 0 rgba(255,255,255,.05)}.cn-sidebar-journey-glow{position:absolute;width:90px;height:90px;right:-25px;top:-25px;border-radius:50%;background:rgba(58,215,175,.16);filter:blur(22px)}.cn-sidebar-journey-kicker{font-size:9px;letter-spacing:.16em;font-weight:900;color:#79a8be;position:relative}.cn-sidebar-journey-title{font-size:17px;font-weight:850;color:#f5f9fc;letter-spacing:-.035em;margin-top:5px;position:relative}.cn-sidebar-journey-steps{display:flex;align-items:center;gap:5px;margin-top:11px;font-size:9px;color:#b9cad8;position:relative}.cn-sidebar-journey-steps i{font-style:normal;color:#f5c451;font-size:10px}.cn-sidebar-journey-line{height:3px;border-radius:99px;background:rgba(255,255,255,.07);margin-top:11px;overflow:hidden;position:relative}.cn-sidebar-journey-line span{display:block;width:58%;height:100%;border-radius:99px;background:linear-gradient(90deg,#2ec7ad,#f5c451);box-shadow:0 0 12px rgba(46,199,173,.24)}.cn-sidebar-journey-note{font-size:9px;color:#7892a8;margin-top:8px;position:relative}.cn-root.light .cn-sidebar-journey{background:linear-gradient(145deg,rgba(237,249,246,.92),rgba(222,242,238,.72));border-color:rgba(11,130,119,.15);box-shadow:0 16px 34px rgba(33,89,98,.08),inset 0 1px 0 rgba(255,255,255,.80)}.cn-root.light .cn-sidebar-journey-kicker{color:#4d7d7a}.cn-root.light .cn-sidebar-journey-title{color:#173047}.cn-root.light .cn-sidebar-journey-steps{color:#5d7387}.cn-root.light .cn-sidebar-journey-note{color:#6e8793}.cn-root.light .cn-sidebar-journey-line{background:rgba(19,67,76,.08)}
  .cn-dashboard-top{display:grid;grid-template-columns:minmax(270px,330px) minmax(420px,1fr) 105px auto;align-items:center;gap:18px;margin-bottom:22px;position:relative;padding:0}.cn-dashboard-top::after{content:"";position:absolute;right:-20px;bottom:-14px;width:360px;height:150px;pointer-events:none;background:radial-gradient(ellipse at center,rgba(68,221,184,.12),transparent 68%);filter:blur(18px)}
  .cn-dashboard-search{width:270px;position:relative;z-index:2}.cn-dashboard-search input{padding-left:40px;background:rgba(255,255,255,.76);height:46px}.cn-root:not(.light) .cn-dashboard-search input{background:rgba(8,25,43,.76)}
  .cn-theme-toggle{width:46px;height:46px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--border-soft);background:var(--surface);color:var(--gold);cursor:pointer;box-shadow:0 9px 26px rgba(7,19,33,.10);transition:transform .2s,background .2s,border-color .2s,box-shadow .2s}.cn-theme-toggle:hover{transform:rotate(-8deg) scale(1.05);border-color:var(--border);box-shadow:0 13px 32px rgba(7,19,33,.16)}
  .cn-hero-copy{padding:2px 4px 0;position:relative;z-index:2}.cn-hero-greeting{font-size:13px;color:var(--gold);font-weight:800;letter-spacing:.10em;text-transform:uppercase;margin-bottom:4px}.cn-hero-name{font-size:31px;line-height:1.08;font-weight:850;color:var(--text);letter-spacing:-.05em}.cn-hero-sub{font-size:14px;color:var(--text-muted);margin-top:8px}.cn-dashboard-slogan{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;min-width:90px;font-family:cursive;font-size:23px;line-height:.88;font-style:italic;font-weight:700;color:var(--gold);opacity:.68;transform:rotate(-4deg);pointer-events:none}.cn-dashboard-slogan span:nth-child(2){margin-left:13px}.cn-dashboard-slogan span:nth-child(3){margin-left:3px}.cn-dashboard-journey{min-width:0;aspect-ratio:1032/328;min-height:0;overflow:visible;display:flex;align-items:center;justify-content:center;background:transparent;border:0;box-shadow:none}.cn-dashboard-journey img{display:block;width:100%;height:auto;aspect-ratio:auto;object-fit:contain;object-position:center;max-width:none;filter:drop-shadow(0 14px 26px rgba(24,79,88,.10));-webkit-mask-image:linear-gradient(to right,transparent 0%,black 5%,black 95%,transparent 100%);mask-image:linear-gradient(to right,transparent 0%,black 5%,black 95%,transparent 100%)}.cn-root:not(.light) .cn-dashboard-journey img{filter:drop-shadow(0 14px 28px rgba(0,0,0,.18));-webkit-mask-image:linear-gradient(to right,transparent 0%,black 4%,black 96%,transparent 100%);mask-image:linear-gradient(to right,transparent 0%,black 4%,black 96%,transparent 100%)}
  .cn-dashboard-actions{display:flex;align-items:center;gap:10px}.cn-dashboard-actions .cn-dashboard-search{width:270px}

  .cn-stat{position:relative;overflow:hidden;padding:19px 18px 17px;min-height:120px;background:linear-gradient(145deg,var(--surface),rgba(255,255,255,.025))}.cn-stat::after{content:"";position:absolute;width:150px;height:150px;right:-68px;top:-75px;border-radius:50%;background:var(--stat-glow,rgba(37,99,235,.10));filter:blur(3px)}.cn-stat::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(125deg,rgba(255,255,255,.07),transparent 42%)}
  .cn-stat-icon{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:11px;box-shadow:0 9px 22px rgba(7,19,33,.09);border:1px solid rgba(255,255,255,.13)}.cn-stat-value{font-size:26px;line-height:1;font-weight:850;color:var(--text)}.cn-stat-label{font-size:12px;color:var(--text-muted);margin-top:7px;font-weight:600}.cn-stat-note{font-size:11px;color:var(--stat-color,var(--sage));margin-top:8px;font-weight:700}
  .cn-section-title{font-size:15px;font-weight:800;color:var(--text)}.cn-section-link{font-size:12px;color:var(--gold);font-weight:750;cursor:pointer}
  .cn-recent-row{display:flex;align-items:center;gap:12px;padding:12px 8px;border-bottom:1px solid var(--border-soft);border-radius:12px;transition:background .18s,transform .18s}.cn-recent-row:last-child{border-bottom:0}.cn-recent-row:hover{background:var(--gold-soft);transform:translateX(3px)}.cn-company-dot{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--surface-2);color:var(--company-color,var(--gold));font-weight:900;font-size:12px;flex:0 0 auto;border:1px solid var(--border-soft);box-shadow:0 6px 16px rgba(7,19,33,.08)}
  .cn-motivation{min-height:285px;position:relative;overflow:hidden;background:linear-gradient(145deg,#e9f8ff 0%,#eefaf1 56%,#d9f0e6 100%);border-color:rgba(37,99,235,.12);box-shadow:0 22px 50px rgba(31,91,106,.10)}.cn-motivation::before{content:"";position:absolute;width:300px;height:170px;left:-35px;bottom:-55px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(37,99,235,.17),transparent 68%);filter:blur(3px)}.cn-motivation::after{content:"";position:absolute;right:-30px;top:65px;width:200px;height:105px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,255,255,.94),rgba(255,255,255,0) 68%);filter:blur(3px)}.cn-motivation-copy{position:relative;z-index:4}.cn-motivation-kicker{font-size:10px;font-weight:900;letter-spacing:.18em;color:#4f7089}.cn-motivation-title{font-size:26px;line-height:.98;font-weight:900;letter-spacing:-.05em;color:#12243d;margin-top:8px}.cn-motivation-sub{font-size:11px;line-height:1.5;color:#526b82;margin-top:11px;max-width:190px}.cn-motivation-scene{position:absolute;left:-5%;right:-4%;bottom:-1px;height:56%;z-index:2;overflow:hidden}.cn-motivation-scene::before{content:"";position:absolute;left:-6%;right:-4%;bottom:-22%;height:125%;background:linear-gradient(155deg,transparent 0 29%,#9fc4a7 29% 43%,#7fb58c 43% 58%,#b9d8b8 58% 100%);clip-path:polygon(0 100%,18% 68%,33% 79%,48% 40%,59% 56%,75% 26%,100% 100%)}.cn-motivation-scene::after{content:"";position:absolute;left:22%;bottom:-8%;width:58%;height:92%;background:linear-gradient(158deg,transparent 0 43%,rgba(255,255,255,.95) 43% 52%,#e9c45b 52% 59%,rgba(255,255,255,0) 59%);clip-path:polygon(45% 0,67% 0,58% 25%,77% 45%,64% 63%,100% 100%,0 100%,35% 65%,48% 43%,37% 25%);opacity:.9}.cn-mountain{position:absolute;left:10%;right:10%;bottom:0;height:42%;opacity:.75;background:linear-gradient(145deg,transparent 0 25%,rgba(37,99,235,.12) 25% 50%,transparent 50% 100%);clip-path:polygon(0 100%,35% 40%,50% 68%,67% 20%,100% 100%)}.cn-motivation-sun{position:absolute;right:26px;bottom:74px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff4a9 0 36%,rgba(255,215,79,.5) 37% 65%,transparent 66%);filter:blur(.2px);z-index:3}.cn-motivation-bird{position:absolute;right:47px;top:76px;font-size:18px;z-index:4;color:#34526a;transform:rotate(-10deg)}
  .cn-root:not(.light) .cn-motivation{background:linear-gradient(145deg,#071a2d 0%,#09233a 56%,#071421 100%);border-color:rgba(245,196,81,.18);box-shadow:0 24px 60px rgba(0,0,0,.18)}.cn-root:not(.light) .cn-motivation::before{background:radial-gradient(ellipse at center,rgba(245,196,81,.17),transparent 68%)}.cn-root:not(.light) .cn-motivation::after{background:radial-gradient(ellipse at center,rgba(61,109,151,.22),transparent 68%)}.cn-root:not(.light) .cn-motivation-kicker{color:#91a9bf}.cn-root:not(.light) .cn-motivation-title{color:#f7fbff}.cn-root:not(.light) .cn-motivation-sub{color:#b7c8d9}.cn-root:not(.light) .cn-motivation-scene::before{background:linear-gradient(155deg,transparent 0 29%,#183b4d 29% 43%,#0f2c3e 43% 58%,#1b3c49 58% 100%)}.cn-root:not(.light) .cn-motivation-scene::after{background:linear-gradient(158deg,transparent 0 43%,rgba(255,240,171,.96) 43% 52%,#f5c451 52% 59%,rgba(255,255,255,0) 59%)}.cn-root:not(.light) .cn-mountain{opacity:.7;background:linear-gradient(150deg,transparent 0 25%,rgba(18,65,78,.75) 25% 49%,transparent 49% 100%)}.cn-root:not(.light) .cn-motivation-sun{background:radial-gradient(circle,#f9e8a3 0 26%,rgba(245,196,81,.28) 27% 66%,transparent 67%);box-shadow:0 0 25px rgba(245,196,81,.18)}
  .cn-chart-card{min-height:285px}.cn-donut-wrap{display:flex;align-items:center;gap:14px}.cn-legend{display:flex;flex-direction:column;gap:10px;min-width:132px}.cn-legend-row{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted);min-height:20px}.cn-legend-dot{width:10px;height:10px;border-radius:50%;box-shadow:0 0 0 3px rgba(255,255,255,.03)}.cn-donut-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none}.cn-donut-total{font-size:25px;font-weight:900;color:var(--text);line-height:1}.cn-donut-label{font-size:10px;color:var(--text-muted);margin-top:3px}.cn-filter{position:relative}.cn-filter-menu{position:absolute;right:0;top:calc(100% + 8px);z-index:20;min-width:150px;padding:7px;background:var(--surface);border:1px solid var(--border-soft);border-radius:13px;box-shadow:0 22px 48px rgba(0,0,0,.20);backdrop-filter:blur(18px)}.cn-filter-option{display:flex;align-items:center;width:100%;padding:8px 10px;border-radius:9px;border:0;background:transparent;color:var(--text-muted);font-size:12px;text-align:left;cursor:pointer}.cn-filter-option:hover{background:var(--gold-soft);color:var(--text)}.cn-filter-option.active{background:var(--gold-soft);color:var(--gold);font-weight:800}
  @media(max-width:1100px){.cn-dashboard-top{grid-template-columns:minmax(220px,290px) minmax(300px,1fr) auto;gap:14px}.cn-dashboard-journey{height:auto}.cn-dashboard-slogan{display:none}.cn-dashboard-actions .cn-dashboard-search{width:230px}}
  @media(max-width:860px){.cn-sidebar{display:none}.cn-card{border-radius:16px}.cn-mobile-logo{width:145px}.cn-dashboard-top{grid-template-columns:1fr;align-items:flex-start;gap:10px}.cn-dashboard-search{display:none}.cn-hero-name{font-size:25px}.cn-dashboard-slogan{display:none}.cn-dashboard-journey{display:flex;width:100%;order:2}.cn-dashboard-actions{order:3;justify-content:flex-end}.cn-dashboard-journey img{width:100%}.cn-stat{min-height:105px}.cn-motivation{min-height:250px}.cn-donut-wrap{justify-content:center}.cn-donut-wrap>div:first-child{width:190px!important;height:190px!important;flex-basis:190px!important}.cn-legend{min-width:120px}.cn-logo-shell{width:190px;height:135px;padding:0}}
  @media(min-width:861px){.cn-bottomnav{display:none}}`;


const CATEGORIES = ["Software / IT", "Government", "Non-Tech"];
const CATEGORY_STYLE = {
  "Software / IT": { text: "var(--teal)", bg: "rgba(43,138,120,0.14)" },
  "Government": { text: "var(--sage)", bg: "rgba(111,154,114,0.14)" },
  "Non-Tech": { text: "var(--clay)", bg: "rgba(199,123,95,0.14)" },
};
const STATUS_OPTIONS = ["In Progress", "Interview", "Offer", "Rejected", "Withdrawn", "Joined"];
const STATUS_STYLE = {
  "In Progress": { text: "var(--blue)", bg: "rgba(110,147,190,0.14)" },
  "Interview": { text: "var(--gold)", bg: "var(--gold-soft)" },
  "Offer": { text: "var(--sage)", bg: "rgba(111,154,114,0.14)" },
  "Rejected": { text: "var(--red)", bg: "rgba(192,85,74,0.14)" },
  "Withdrawn": { text: "var(--grey)", bg: "rgba(138,133,120,0.14)" },
  "Joined": { text: "var(--teal)", bg: "rgba(43,138,120,0.14)" },
};
const SOURCES = ["LinkedIn", "Naukri", "Company Website", "Referral", "College", "Other"];
const DEFAULT_STAGES = {
  "Software / IT": ["Applied", "Screening", "Assessment", "Technical Interview", "HR Interview", "Offer"],
  "Government": ["Application Submitted", "Admit Card", "CBT-1", "CBT-2", "Skill Test", "Document Verification", "Medical", "Final Result"],
  "Non-Tech": ["Applied", "Screening", "Interview", "HR Interview", "Offer"],
};
const STAGE_STATUSES = ["pending", "in_progress", "completed", "failed", "skipped"];
const STAGE_META = {
  pending: { label: "Pending", icon: Circle, color: "var(--text-faint)" },
  in_progress: { label: "In Progress", icon: Clock, color: "var(--gold)" },
  completed: { label: "Completed", icon: CheckCircle2, color: "var(--sage)" },
  failed: { label: "Failed", icon: XCircle, color: "var(--red)" },
  skipped: { label: "Skipped", icon: SkipForward, color: "var(--text-faint)" },
};
const EXPERIENCE_LEVELS = ["Student / Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
const STORAGE_KEY = "careernest-data-v1";
function userStorageKey(userId) {
  return `${STORAGE_KEY}-${userId}`;
}

/* ============================== HELPERS ============================== */
function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}
function nowISO() { return new Date().toISOString(); }
function companyMark(name) {
  const value = (name || "?").trim();
  const words = value.split(/\s+/).filter(Boolean);
  const mark = words.length > 1 ? words.slice(0, 2).map(w => w[0]).join("") : value.slice(0, 1);
  const palette = ["#2563eb", "#0b8277", "#8b5cf6", "#d96826", "#159447", "#d93645", "#d89d22"];
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash) + value.charCodeAt(i);
  return { mark: mark.toUpperCase().slice(0, 2), color: palette[Math.abs(hash) % palette.length] };
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function makeStages(category) {
  return (DEFAULT_STAGES[category] || DEFAULT_STAGES["Software / IT"]).map((name, i) => ({
    id: uid(), name, order: i, status: "pending", completedDate: null, notes: "",
  }));
}
function sampleData() {
  const app1Stages = makeStages("Software / IT");
  app1Stages[0].status = "completed"; app1Stages[0].completedDate = nowISO();
  app1Stages[1].status = "completed"; app1Stages[1].completedDate = nowISO();
  app1Stages[2].status = "in_progress";
  const app2Stages = makeStages("Government");
  app2Stages[0].status = "completed"; app2Stages[0].completedDate = nowISO();
  app2Stages[1].status = "in_progress";
  const resumeIT = { id: uid(), name: "Software Resume V1", category: "Software / IT", fileName: "software-resume-v1.pdf", fileData: null, createdAt: nowISO(), updatedAt: nowISO() };
  const resumeGovt = { id: uid(), name: "Government Resume", category: "Government", fileName: "government-resume.pdf", fileData: null, createdAt: nowISO(), updatedAt: nowISO() };
  return {
    profile: { name: "", email: "", phone: "", location: "", experienceLevel: "Student / Fresher", theme: "dark" },
    resumes: [resumeIT, resumeGovt],
    applications: [
      {
        id: uid(), companyName: "Tata Consultancy Services", jobRole: "Software Engineer Trainee",
        category: "Software / IT", appliedDate: nowISO(), location: "Hyderabad", workType: "Full-time",
        salary: "4.5 LPA", applicationSource: "Company Website", jobLink: "", resumeId: resumeIT.id,
        status: "Interview", notes: "Referred by senior from college.", createdAt: nowISO(), updatedAt: nowISO(),
        archivedAt: null, stages: app1Stages,
      },
      {
        id: uid(), companyName: "SSC CGL", jobRole: "Junior Assistant",
        category: "Government", appliedDate: nowISO(), location: "Andhra Pradesh", workType: "Full-time",
        salary: "As per pay scale", applicationSource: "Other", jobLink: "", resumeId: resumeGovt.id,
        status: "In Progress", notes: "", createdAt: nowISO(), updatedAt: nowISO(),
        archivedAt: null, stages: app2Stages,
      },
    ],
  };
}
async function loadData(userId) {
  try {
    if (!userId) return null;
    const raw = localStorage.getItem(userStorageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
async function saveData(userId, data) {
  try {
    if (!userId) return;
    localStorage.setItem(userStorageKey(userId), JSON.stringify(data)); }
  catch (e) { console.error("CareerNest: could not save data", e); }
}

/* ============================== SMALL UI ============================== */
function NestLogo({ variant = "brand", className = "" }) {
  const cls = variant === "mobile" ? "cn-mobile-logo" : variant === "loading" ? "cn-loading-logo" : "cn-brand-logo";
  const shellClass = variant === "brand" ? "cn-logo-shell cn-logo-organic" : "cn-logo-shell";
  return <div className={shellClass}>
    <img src={careerNestLogo} alt="CareerNest" className={`${cls} ${className}`.trim()} />
  </div>;
}
function Pill({ text, style }) {
  return (
    <span style={{ color: style.text, background: style.bg }}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
      {text}
    </span>
  );
}
function EmptyState({ title, body, actionLabel, onAction }) {
  return (
    <div className="cn-card flex flex-col items-center text-center py-16 px-6">
      <div style={{ background: "var(--gold-soft)" }} className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
        <Briefcase size={20} color="var(--gold)" />
      </div>
      <p className="cn-serif text-lg mb-1">{title}</p>
      <p style={{ color: "var(--text-muted)" }} className="text-sm mb-5 max-w-sm">{body}</p>
      {actionLabel && (
        <button className="cn-btn-gold" onClick={onAction}><Plus size={15} />{actionLabel}</button>
      )}
    </div>
  );
}
function ProgressBar({ pct, color = "var(--gold)" }) {
  return (
    <div style={{ background: "var(--surface-2)" }} className="w-full h-1.5 rounded-full overflow-hidden">
      <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full transition-all" />
    </div>
  );
}
function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <div style={{ background: "rgba(0,0,0,0.55)" }} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className={"cn-card w-full max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] flex flex-col " + (wide ? "max-w-2xl" : "max-w-md")}>
        <div style={{ borderBottom: "1px solid var(--border-soft)" }} className="flex items-center justify-between px-6 py-4 shrink-0">
          <p className="cn-serif text-lg">{title}</p>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }} aria-label={"Close " + title}><X size={18} /></button>
        </div>
        <div className="px-6 py-5 overflow-y-auto min-h-0">{children}</div>
      </div>
    </div>
  );
}
function StatCard({ label, value, accent }) {
  return (
    <div className="cn-card px-5 py-4">
      <p style={{ color: "var(--text-muted)" }} className="text-xs mb-2">{label}</p>
      <p className="cn-serif text-2xl" style={{ color: accent || "var(--text)" }}>{value}</p>
    </div>
  );
}

/* ============================== NAV ============================== */
const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "applications", label: "Applications", icon: Briefcase },
  { key: "files", label: "Career Files", icon: FileText },
  { key: "archive", label: "Archive", icon: ArchiveIcon },
  { key: "profile", label: "Profile", icon: User },
];
function Sidebar({ page, setPage, onAdd, onLogout }) {
  return (
    <aside className="cn-sidebar w-60 shrink-0 h-screen sticky top-0 flex flex-col px-4 py-6"
      style={{ borderRight: "1px solid var(--border-soft)" }}>
      <div className="px-0 mb-1 flex justify-center">
        <NestLogo variant="brand" />
      </div>
      <p style={{ color: "var(--text-muted)" }} className="text-xs px-2 mt-0 mb-6 text-center leading-5">Your career, organized and protected.</p>

      <button className="cn-btn-gold w-full justify-center mb-7" onClick={onAdd}>
        <Plus size={15} /> Add Application
      </button>

      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map(item => (
          <div key={item.key} className={"cn-nav-item " + (page === item.key || (page === "detail" && item.key === "applications") ? "active" : "")}
            onClick={() => setPage(item.key)}>
            <item.icon size={16} /> {item.label}
          </div>
        ))}
      </nav>

      <div className="cn-sidebar-art" aria-hidden="true"><span className="wave" /><span className="wave-2" /><span className="stem" /><span className="leaf-a" /><span className="leaf-b" /><span className="leaf-c" /><span className="leaf-d" /></div>

      <div className="mt-auto relative z-10 flex flex-col gap-2">
        <div className="px-3 pt-2" style={{ color: "var(--text-faint)" }}>
          <p className="text-[12px]">Your Career Journey</p><p className="text-[12px]">Our Priority</p>
        </div>
        <button type="button" className="cn-btn-ghost w-full justify-center" onClick={onLogout} title="Sign out of CareerNest" aria-label="Sign out of CareerNest" style={{ color: "var(--red)" }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}
function BottomNav({ page, setPage }) {
  const items = NAV_ITEMS.filter(i => i.key !== "archive");
  return (
    <nav className="cn-bottomnav fixed bottom-0 left-0 right-0 z-40 flex justify-around py-2"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border-soft)" }}>
      {items.map(item => (
        <div key={item.key} className="flex flex-col items-center gap-1 px-3 py-1 cursor-pointer"
          style={{ color: (page === item.key || (page === "detail" && item.key === "applications")) ? "var(--gold)" : "var(--text-muted)" }}
          onClick={() => setPage(item.key)}>
          <item.icon size={18} />
          <span className="text-[10px]">{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

/* ============================== ADD APPLICATION MODAL ============================== */
function AddApplicationPage({ onClose, onSave, resumes }) {
  const [form, setForm] = useState({
    companyName: "", jobRole: "", category: "Software / IT", appliedDate: new Date().toISOString().slice(0, 10),
    location: "", workType: "Full-time", salary: "", applicationSource: "LinkedIn", jobLink: "", resumeId: "", notes: "",
  });
  const [error, setError] = useState("");
  const [availableResumes, setAvailableResumes] = useState(resumes);

  useEffect(() => {
    setAvailableResumes(resumes);
  }, [resumes]);

  useEffect(() => {
    let cancelled = false;
    if (resumes.length > 0) return;
    (async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("id,name,category,file_name,file_path,created_at,updated_at")
        .order("created_at", { ascending: false });
      if (!cancelled && !error) {
        setAvailableResumes((data || []).map(r => ({
          id: r.id, name: r.name || "Unnamed resume", category: r.category || "Software / IT",
          fileName: r.file_name || "resume.pdf", filePath: r.file_path || "",
          createdAt: r.created_at, updatedAt: r.updated_at,
        })));
      }
    })();
    return () => { cancelled = true; };
  }, [resumes]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const relevantResumes = availableResumes;

  function submit(e) {
    e.preventDefault();
    if (!form.companyName.trim() || !form.jobRole.trim()) { setError("Company name and job role are required."); return; }
    onSave({ ...form, appliedDate: new Date(form.appliedDate).toISOString() });
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="cn-serif text-2xl">Add Application</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Track a new opportunity in your CareerNest.</p>
        </div>
        <button type="button" className="cn-btn-ghost" onClick={onClose}><ArrowLeft size={14} /> Back to applications</button>
      </div>
      <div className="cn-card p-6">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="cn-label">Company name</label>
          <input className="cn-input" value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="e.g. Infosys" />
        </div>
        <div>
          <label className="cn-label">Job role</label>
          <input className="cn-input" value={form.jobRole} onChange={e => set("jobRole", e.target.value)} placeholder="e.g. SDE-1" />
        </div>
        <div>
          <label className="cn-label">Category</label>
          <select className="cn-input" value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cn-label">Applied date</label>
          <input type="date" className="cn-input" value={form.appliedDate} onChange={e => set("appliedDate", e.target.value)} />
        </div>
        <div>
          <label className="cn-label">Location</label>
          <input className="cn-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Bengaluru" />
        </div>
        <div>
          <label className="cn-label">Work type</label>
          <input className="cn-input" value={form.workType} onChange={e => set("workType", e.target.value)} placeholder="Full-time, Internship…" />
        </div>
        <div>
          <label className="cn-label">Salary / CTC</label>
          <input className="cn-input" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. 6 LPA" />
        </div>
        <div>
          <label className="cn-label">Application source</label>
          <select className="cn-input" value={form.applicationSource} onChange={e => set("applicationSource", e.target.value)}>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Job link (reference only — CareerNest never auto-applies)</label>
          <input className="cn-input" value={form.jobLink} onChange={e => set("jobLink", e.target.value)} placeholder="https://…" />
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Resume used</label>
          <select className="cn-input" value={form.resumeId} onChange={e => set("resumeId", e.target.value)}>
            <option value="">— None selected —</option>
            {relevantResumes.map(r => <option key={r.id} value={r.id}>{r.name} · {r.category}</option>)}
            {relevantResumes.length === 0 && <option disabled>No resumes uploaded yet — add one in Career Files</option>}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Notes</label>
          <textarea className="cn-input" rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Anything worth remembering…" />
        </div>

        {error && <p style={{ color: "var(--red)" }} className="md:col-span-2 text-xs">{error}</p>}

        <div className="md:col-span-2 flex justify-end gap-3 pt-1">
          <button type="button" className="cn-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="cn-btn-gold">Save application</button>
        </div>
      </form>
      </div>
    </div>
  );
}

/* ============================== EDIT APPLICATION MODAL ============================== */
function EditApplicationPage({ onClose, onSave, resumes, app }) {
  const [form, setForm] = useState({
    companyName: app.companyName || "",
    jobRole: app.jobRole || "",
    category: app.category || "Software / IT",
    appliedDate: app.appliedDate ? String(app.appliedDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
    location: app.location || "",
    workType: app.workType || "Full-time",
    salary: app.salary || "",
    applicationSource: app.applicationSource || "LinkedIn",
    jobLink: app.jobLink || "",
    resumeId: app.resumeId || "",
    notes: app.notes || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [availableResumes, setAvailableResumes] = useState(resumes);

  useEffect(() => {
    setAvailableResumes(resumes);
  }, [resumes]);

  useEffect(() => {
    let cancelled = false;
    if (resumes.length > 0) return;
    (async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("id,name,category,file_name,file_path,created_at,updated_at")
        .order("created_at", { ascending: false });
      if (!cancelled && !error) {
        setAvailableResumes((data || []).map(r => ({
          id: r.id, name: r.name || "Unnamed resume", category: r.category || "Software / IT",
          fileName: r.file_name || "resume.pdf", filePath: r.file_path || "",
          createdAt: r.created_at, updatedAt: r.updated_at,
        })));
      }
    })();
    return () => { cancelled = true; };
  }, [resumes]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const relevantResumes = availableResumes;

  async function submit(e) {
    e.preventDefault();
    if (!form.companyName.trim() || !form.jobRole.trim()) {
      setError("Company name and job role are required.");
      return;
    }

    setError("");
    setSaving(true);
    const ok = await onSave({ ...form, appliedDate: form.appliedDate });
    setSaving(false);
    if (!ok) return;
    onClose();
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="cn-serif text-2xl">Edit Application</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Update the details for {app.companyName}.</p>
        </div>
        <button type="button" className="cn-btn-ghost" onClick={onClose} disabled={saving}><ArrowLeft size={14} /> Back to applications</button>
      </div>
      <div className="cn-card p-6">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="cn-label">Company name</label>
          <input className="cn-input" value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="e.g. Infosys" />
        </div>
        <div>
          <label className="cn-label">Job role</label>
          <input className="cn-input" value={form.jobRole} onChange={e => set("jobRole", e.target.value)} placeholder="e.g. SDE-1" />
        </div>
        <div>
          <label className="cn-label">Category</label>
          <select className="cn-input" value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cn-label">Applied date</label>
          <input type="date" className="cn-input" value={form.appliedDate} onChange={e => set("appliedDate", e.target.value)} />
        </div>
        <div>
          <label className="cn-label">Location</label>
          <input className="cn-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Bengaluru" />
        </div>
        <div>
          <label className="cn-label">Work type</label>
          <input className="cn-input" value={form.workType} onChange={e => set("workType", e.target.value)} placeholder="Full-time, Internship…" />
        </div>
        <div>
          <label className="cn-label">Salary / CTC</label>
          <input className="cn-input" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. 6 LPA" />
        </div>
        <div>
          <label className="cn-label">Application source</label>
          <select className="cn-input" value={form.applicationSource} onChange={e => set("applicationSource", e.target.value)}>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Job link (reference only — CareerNest never auto-applies)</label>
          <input className="cn-input" value={form.jobLink} onChange={e => set("jobLink", e.target.value)} placeholder="https://…" />
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Resume used</label>
          <select className="cn-input" value={form.resumeId} onChange={e => set("resumeId", e.target.value)}>
            <option value="">— None selected —</option>
            {relevantResumes.map(r => <option key={r.id} value={r.id}>{r.name} · {r.category}</option>)}
            {relevantResumes.length === 0 && <option disabled>No resumes uploaded yet — add one in Career Files</option>}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Notes</label>
          <textarea className="cn-input" rows={3} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Anything worth remembering…" />
        </div>

        {error && <p style={{ color: "var(--red)" }} className="md:col-span-2 text-xs">{error}</p>}

        <div className="md:col-span-2 flex justify-end gap-3 pt-1">
          <button type="button" className="cn-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="cn-btn-gold" disabled={saving}>{saving ? "Saving changes…" : "Save changes"}</button>
        </div>
      </form>
      </div>
    </div>
  );
}

/* ============================== ADD RESUME MODAL ============================== */
function AddResumeModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Software / IT");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError("Keep resume files under 10MB."); return; }
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF resume.");
      return;
    }
    setError("");
    setFile(f);
  }

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Give this resume a name."); return; }
    if (!file) { setError("Please select a PDF resume."); return; }
    setError("");
    setSaving(true);
    const ok = await onSave({ name: name.trim(), category, file });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Modal title="Add Resume" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="cn-label">Resume name</label>
          <input className="cn-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Software Resume V2" disabled={saving} />
        </div>
        <div>
          <label className="cn-label">Category</label>
          <select className="cn-input" value={category} onChange={e => setCategory(e.target.value)} disabled={saving}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cn-label">PDF resume</label>
          <input type="file" accept="application/pdf,.pdf" onChange={handleFile}
            style={{ color: "var(--text-muted)" }} className="text-xs" disabled={saving} />
          {file && <p style={{ color: "var(--text-muted)" }} className="text-xs mt-2">{file.name}</p>}
        </div>
        {error && <p style={{ color: "var(--red)" }} className="text-xs">{error}</p>}
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" className="cn-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="cn-btn-gold" disabled={saving}>{saving ? "Uploading…" : "Upload resume"}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ============================== HOME ============================== */
function HomePage({ applications, resumes, setPage, openAdd, profile, setProfile, session }) {
  const [period, setPeriod] = useState("This Month");
  const [filterOpen, setFilterOpen] = useState(false);
  const periods = ["This Month", "Last Month", "Last 3 Months", "This Year", "All Time"];

  const active = useMemo(() => applications.filter(a => !a.archivedAt), [applications]);
  const filteredActive = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    let start = null;
    let end = null;

    if (period === "This Month") {
      start = startOfCurrentMonth;
      end = new Date(currentYear, currentMonth + 1, 1);
    } else if (period === "Last Month") {
      start = new Date(currentYear, currentMonth - 1, 1);
      end = startOfCurrentMonth;
    } else if (period === "Last 3 Months") {
      start = new Date(currentYear, currentMonth - 2, 1);
      end = new Date(currentYear, currentMonth + 1, 1);
    } else if (period === "This Year") {
      start = new Date(currentYear, 0, 1);
      end = new Date(currentYear + 1, 0, 1);
    }

    if (!start || !end) return active;
    return active.filter(a => {
      const raw = a.appliedDate || a.createdAt;
      if (!raw) return false;
      const d = new Date(raw);
      return d >= start && d < end;
    });
  }, [active, period]);

  const counts = {
    total: filteredActive.length,
    inProgress: filteredActive.filter(a => a.status === "In Progress").length,
    interview: filteredActive.filter(a => a.status === "Interview").length,
    offer: filteredActive.filter(a => a.status === "Offer").length,
    rejected: filteredActive.filter(a => a.status === "Rejected").length,
    withdrawn: filteredActive.filter(a => a.status === "Withdrawn").length,
  };
  const byStatus = [
    { name: "In Progress", value: counts.inProgress, color: "#3b82f6" },
    { name: "Interview", value: counts.interview, color: "#f5b82e" },
    { name: "Offer", value: counts.offer, color: "#4caf67" },
    { name: "Rejected", value: counts.rejected, color: "#ef5350" },
    { name: "Withdrawn", value: counts.withdrawn, color: "#94a3b8" },
  ].filter(x => x.value > 0);
  const recent = filteredActive.slice().sort((a,b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt)).slice(0,5);
  const totalForPct = Math.max(filteredActive.length,1);
  const pct = n => Math.round((n / totalForPct) * 100);
  const displayName = profile?.name?.trim() || "there";
  const greeting = new Date().getHours() < 12 ? "Good Morning," : new Date().getHours() < 18 ? "Good Afternoon," : "Good Evening,";
  const initials = session?.user?.email?.trim()?.charAt(0).toUpperCase() || "?";
  const isLight = profile?.theme === "light";

  function toggleTheme() {
    setProfile(prev => ({ ...prev, theme: prev.theme === "light" ? "dark" : "light" }));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="cn-dashboard-top">
        <div className="cn-hero-copy">
          <div className="cn-hero-greeting">{greeting}</div>
          <div className="cn-hero-name">{displayName} <span aria-hidden="true">👋</span></div>
          <div className="cn-hero-sub">{isLight ? "Keep going! Every application is a step towards your future." : "Discipline today, success tomorrow."}</div>
        </div>
        <div className="cn-dashboard-journey" aria-label="Career journey illustration">
          <img src={isLight ? "/career-journey-light.png" : "/career-journey-center.png"} alt="Career journey from challenges to growth" />
        </div>
        <div className="cn-dashboard-slogan" aria-label="Progress Lives Here">
          <span>Progress</span><span>Lives</span><span>Here</span>
        </div>
        <div className="cn-dashboard-actions">
          <div className="cn-dashboard-search">
            <Search size={17} style={{position:"absolute",left:13,top:13,color:"var(--text-faint)"}} />
            <input className="cn-input" placeholder="Search applications…" onKeyDown={e => { if(e.key === "Enter") setPage("applications") }} />
          </div>
          <button className="cn-theme-toggle" onClick={toggleTheme} title={isLight ? "Switch to dark theme" : "Switch to light theme"} aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}>
            {isLight ? <Sun size={18}/> : <Moon size={18}/>} 
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer" onClick={() => setPage("profile")} title="Open profile" aria-label="Open profile" style={{background:"var(--surface-3)",border:"1px solid var(--border-soft)",color:"var(--text)"}}>{initials}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button type="button" className="cn-card cn-stat text-left w-full cursor-pointer" style={{"--stat-glow":"rgba(59,130,246,.14)"}} onClick={() => setPage("applications", "All")} aria-label="View all applications">
          <div className="cn-stat-icon" style={{background:"rgba(59,130,246,.13)",color:"var(--blue)"}}><FileText size={21}/></div>
          <div className="cn-stat-value">{counts.total}</div><div className="cn-stat-label">Total Applications</div>
          <div className="cn-stat-note">{period === "All Time" ? "Your complete journey" : `${counts.total ? "↑ " : ""}${counts.total ? "Tracked in this period" : "No applications in this period"}`}</div>
        </button>
        <button type="button" className="cn-card cn-stat text-left w-full cursor-pointer" style={{"--stat-glow":"rgba(245,184,46,.13)"}} onClick={() => setPage("applications", "In Progress")} aria-label="View in progress applications">
          <div className="cn-stat-icon" style={{background:"rgba(245,184,46,.14)",color:"#d99a00"}}><Clock size={21}/></div>
          <div className="cn-stat-value">{counts.inProgress}</div><div className="cn-stat-label">In Progress</div>
          <div className="cn-stat-note" style={{"--stat-color":"var(--text-muted)"}}>{pct(counts.inProgress)}% of total</div>
        </button>
        <button type="button" className="cn-card cn-stat text-left w-full cursor-pointer" style={{"--stat-glow":"rgba(74,222,128,.13)"}} onClick={() => setPage("applications", "Offer")} aria-label="View offer applications">
          <div className="cn-stat-icon" style={{background:"rgba(74,222,128,.14)",color:"var(--sage)"}}><Briefcase size={21}/></div>
          <div className="cn-stat-value">{counts.offer}</div><div className="cn-stat-label">Offers</div>
          <div className="cn-stat-note" style={{"--stat-color":"var(--text-muted)"}}>{pct(counts.offer)}% of total</div>
        </button>
        <button type="button" className="cn-card cn-stat text-left w-full cursor-pointer" style={{"--stat-glow":"rgba(139,92,246,.13)"}} onClick={() => setPage("applications", "Interview")} aria-label="View interview applications">
          <div className="cn-stat-icon" style={{background:"rgba(139,92,246,.14)",color:"#8b5cf6"}}><User size={21}/></div>
          <div className="cn-stat-value">{counts.interview}</div><div className="cn-stat-label">Interviews</div>
          <div className="cn-stat-note" style={{"--stat-color":"var(--text-muted)"}}>{pct(counts.interview)}% of total</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr_.72fr] gap-4">
        <div className="cn-card cn-chart-card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="cn-section-title">Applications by Status</p>
            <div className="cn-filter">
              <button className="cn-btn-ghost" style={{padding:"7px 10px",fontSize:11}} onClick={() => setFilterOpen(v => !v)} aria-expanded={filterOpen}>
                {period} <ChevronDown size={13}/>
              </button>
              {filterOpen && (
                <div className="cn-filter-menu">
                  {periods.map(option => (
                    <button key={option} className={`cn-filter-option ${period === option ? "active" : ""}`} onClick={() => { setPeriod(option); setFilterOpen(false); }}>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {filteredActive.length ? (
            <div className="cn-donut-wrap">
              <div style={{position:"relative",width:210,height:210,flex:"0 0 210px"}}>
                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={61} outerRadius={88} paddingAngle={2} stroke="none">{byStatus.map((x,i)=><Cell key={i} fill={x.color}/>)}</Pie></PieChart></ResponsiveContainer>
                <div className="cn-donut-center"><div className="cn-donut-total">{filteredActive.length}</div><div className="cn-donut-label">Total</div></div>
              </div>
              <div className="cn-legend">{byStatus.map(x=><div className="cn-legend-row" key={x.name}><span className="cn-legend-dot" style={{background:x.color}}></span><span>{x.name}</span><strong style={{color:"var(--text)",marginLeft:"auto"}}>{x.value}</strong></div>)}</div>
            </div>
          ) : <EmptyState title="No applications in this period" body="Try another time range or add a new application." actionLabel="Add Application" onAction={openAdd}/>} 
        </div>

        <div className="cn-card cn-chart-card p-5">
          <div className="flex items-center justify-between mb-2"><p className="cn-section-title">Recent Applications</p><button className="cn-section-link" onClick={()=>setPage("applications")}>View All →</button></div>
          {recent.length ? recent.map(a=>{
            const company = companyMark(a.companyName);
            return (
              <div className="cn-recent-row" key={a.id} onClick={()=>setPage("applications")} style={{cursor:"pointer"}}>
                <div className="cn-company-dot" style={{"--company-color":company.color}}>{company.mark}</div>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold truncate">{a.companyName}</p><p className="text-[11px] truncate" style={{color:"var(--text-muted)"}}>{a.jobRole}</p></div>
                <div className="text-right"><Pill text={a.status} style={STATUS_STYLE[a.status] || STATUS_STYLE["In Progress"]}/><p className="text-[10px] mt-1" style={{color:"var(--text-faint)"}}>{fmtDate(a.appliedDate)}</p></div><ChevronRight size={16} style={{color:"var(--text-faint)"}}/>
              </div>
            );
          }) : <p className="text-sm" style={{color:"var(--text-muted)"}}>No applications in this period.</p>}
        </div>

        <div className="cn-card cn-motivation p-5">
          <div className="cn-motivation-copy">
            <p className="cn-motivation-kicker">CAREERNEST</p>
            <p className="cn-motivation-title">{isLight ? <>Small Steps<br/>Big Futures</> : <>Same Goals<br/>Brighter Tomorrows</>}</p>
            <p className="cn-motivation-sub">{isLight ? <>Track. Learn. Grow.<br/>You've got this!</> : <>Track. Plan. Achieve.</>}</p>
            <button className="cn-btn-gold mt-5" onClick={()=>setPage("applications")}>Keep Going <ArrowUpRight size={15}/></button>
          </div>
          <div className="cn-motivation-scene"><div className="cn-mountain"></div></div>
          <div className="cn-motivation-sun"></div>
          <div className="cn-motivation-bird">⌁</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1"><p className="cn-section-title">Your career journey</p><button className="cn-section-link" onClick={openAdd}>+ Add Application</button></div>
    </div>
  );
}
/* ============================== APPLICATIONS LIST ============================== */
function ApplicationsPage({ applications, resumes, openApp, openAdd, openEdit, setPage, initialStatus = "All" }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState("newest");

  const resumeName = (id) => resumes.find(r => r.id === id)?.name;

  const filtered = useMemo(() => {
    let list = applications.filter(a => !a.archivedAt);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(a =>
        a.companyName.toLowerCase().includes(q) ||
        a.jobRole.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (resumeName(a.resumeId) || "").toLowerCase().includes(q) ||
        a.stages.some(s => s.name.toLowerCase().includes(q))
      );
    }
    if (category !== "All") list = list.filter(a => a.category === category);
    if (status !== "All") list = list.filter(a => a.status === status);
    list = list.slice().sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "company") return a.companyName.localeCompare(b.companyName);
      if (sort === "progress") return progressPct(b) - progressPct(a);
      return 0;
    });
    return list;
  }, [applications, query, category, status, sort]);

  function progressPct(a) {
    if (!a.stages.length) return 0;
    return Math.round((a.stages.filter(s => s.status === "completed").length / a.stages.length) * 100);
  }
  function currentStage(a) {
    const inProg = a.stages.find(s => s.status === "in_progress");
    if (inProg) return inProg.name;
    const pending = a.stages.find(s => s.status === "pending");
    if (pending) return pending.name;
    return "All stages done";
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="cn-serif text-2xl">Applications</p>
        <div className="flex gap-2">
          <button className="cn-btn-ghost" onClick={() => setPage("archive")}><ArchiveIcon size={14} /> View Archive</button>
          <button className="cn-btn-gold" onClick={openAdd}><Plus size={15} /> Add Application</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-faint)" }} />
          <input className="cn-input" style={{ paddingLeft: 34 }} placeholder="Search company, role, resume, stage…"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="cn-input" style={{ width: 170 }} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="cn-input" style={{ width: 150 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="cn-input" style={{ width: 150 }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A–Z</option>
          <option value="progress">Most progress</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        applications.filter(a => !a.archivedAt).length === 0 ? (
          <EmptyState title="No applications yet" body="Start tracking your career journey — add the first opportunity you applied to." actionLabel="Add Application" onAction={openAdd} />
        ) : (
          <EmptyState title="No matches" body="Nothing fits that search or filter combination." />
        )
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(a => (
            <div key={a.id} className="cn-card px-5 py-4 cursor-pointer hover:opacity-90" onClick={() => openApp(a.id)}>
              <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] gap-3 md:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.companyName}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.jobRole}</p>
                </div>
                <div><Pill text={a.category.replace("Software / ", "")} style={CATEGORY_STYLE[a.category]} /></div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {currentStage(a)}
                  <ProgressBar pct={progressPct(a)} />
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {resumeName(a.resumeId) || "No resume linked"}<br />
                  Applied {fmtDate(a.appliedDate)}
                </div>
                <div className="flex md:justify-end items-center gap-2">
                  <Pill text={a.status} style={STATUS_STYLE[a.status]} />
                  <button
                    type="button"
                    className="cn-btn-ghost"
                    style={{ padding: "7px 9px" }}
                    title="Edit application"
                    aria-label={`Edit ${a.companyName}`}
                    onClick={(e) => { e.stopPropagation(); openEdit(a.id); }}
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== APPLICATION DETAIL ============================== */
function ApplicationDetail({ app, resumes, updateApp, archiveApp, restoreApp, openEdit, back }) {
  const [newStageName, setNewStageName] = useState("");
  const resume = resumes.find(r => r.id === app.resumeId);
  const completed = app.stages.filter(s => s.status === "completed").length;
  const pct = app.stages.length ? Math.round((completed / app.stages.length) * 100) : 0;
  const current = app.stages.find(s => s.status === "in_progress") || app.stages.find(s => s.status === "pending");

  function patchStage(stageId, patch) {
    const stages = app.stages.map(s => s.id === stageId ? { ...s, ...patch } : s);
    updateApp({ stages });
  }
  function addStage() {
    if (!newStageName.trim()) return;
    const stages = [...app.stages, { id: uid(), name: newStageName.trim(), order: app.stages.length, status: "pending", completedDate: null, notes: "" }];
    updateApp({ stages });
    setNewStageName("");
  }
  function removeStage(stageId) {
    updateApp({ stages: app.stages.filter(s => s.id !== stageId) });
  }
  function moveStage(idx, dir) {
    const stages = [...app.stages];
    const target = idx + dir;
    if (target < 0 || target >= stages.length) return;
    [stages[idx], stages[target]] = [stages[target], stages[idx]];
    updateApp({ stages: stages.map((s, i) => ({ ...s, order: i })) });
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <button className="cn-btn-ghost w-fit" onClick={back}><ArrowLeft size={14} /> Back to applications</button>

      <div className="cn-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="cn-serif text-2xl">{app.companyName}</p>
            <p style={{ color: "var(--text-muted)" }} className="text-sm">{app.jobRole}</p>
          </div>
          <select className="cn-input" style={{ width: 160 }} value={app.status} onChange={e => updateApp({ status: e.target.value })}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
          <div><p className="cn-label">Category</p><Pill text={app.category} style={CATEGORY_STYLE[app.category]} /></div>
          <div><p className="cn-label">Applied date</p>{fmtDate(app.appliedDate)}</div>
          <div><p className="cn-label">Location</p>{app.location || "—"}</div>
          <div><p className="cn-label">Salary / CTC</p>{app.salary || "—"}</div>
          <div><p className="cn-label">Application source</p>{app.applicationSource}</div>
          <div><p className="cn-label">Resume used</p>{resume ? resume.name : "Not linked"}</div>
          <div className="col-span-2"><p className="cn-label">Job link (reference only)</p>
            {app.jobLink ? <a href={app.jobLink} target="_blank" rel="noreferrer" style={{ color: "var(--gold)" }} className="truncate flex items-center gap-1"><Link2 size={12} />{app.jobLink}</a> : "—"}
          </div>
        </div>

        {app.notes && (
          <div className="mb-5">
            <p className="cn-label">Notes</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{app.notes}</p>
          </div>
        )}

        <div className="mb-2 flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{completed} / {app.stages.length} stages completed</span>
          <span>Current: {current ? current.name : "All stages completed"}</span>
        </div>
        <ProgressBar pct={pct} />

        <div className="flex gap-2 mt-5">
          {!app.archivedAt && (
            <button className="cn-btn-gold" onClick={openEdit}><Pencil size={14} /> Edit Application</button>
          )}
          {!app.archivedAt ? (
            <button className="cn-btn-ghost" onClick={archiveApp}><ArchiveIcon size={14} /> Archive</button>
          ) : (
            <button className="cn-btn-ghost" onClick={restoreApp}><RotateCcw size={14} /> Restore</button>
          )}
        </div>
      </div>

      <div className="cn-card p-6">
        <p className="cn-serif text-lg mb-4">Recruitment timeline</p>
        <div className="flex flex-col gap-3">
          {app.stages.map((s, idx) => {
            const meta = STAGE_META[s.status];
            const Icon = meta.icon;
            return (
              <div key={s.id} className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg" style={{ background: "var(--surface-2)" }}>
                <div className="flex items-center gap-2 md:w-48 shrink-0">
                  <Icon size={16} color={meta.color} />
                  <span className="text-sm">{s.name}</span>
                </div>
                <select className="cn-input" style={{ width: 140 }} value={s.status} onChange={e => patchStage(s.id, { status: e.target.value, completedDate: e.target.value === "completed" ? nowISO() : s.completedDate })}>
                  {STAGE_STATUSES.map(st => <option key={st} value={st}>{STAGE_META[st].label}</option>)}
                </select>
                <input className="cn-input flex-1" placeholder="Notes for this stage…" value={s.notes} onChange={e => patchStage(s.id, { notes: e.target.value })} />
                <span className="text-xs shrink-0" style={{ color: "var(--text-faint)" }}>{s.completedDate ? fmtDate(s.completedDate) : ""}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveStage(idx, -1)} style={{ color: "var(--text-faint)" }}><ChevronUp size={16} /></button>
                  <button onClick={() => moveStage(idx, 1)} style={{ color: "var(--text-faint)" }}><ChevronDown size={16} /></button>
                  <button onClick={() => removeStage(s.id)} style={{ color: "var(--text-faint)" }}><X size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <input className="cn-input flex-1" placeholder="Add a custom stage — e.g. Bar Raiser, Group Discussion…" value={newStageName} onChange={e => setNewStageName(e.target.value)} onKeyDown={e => e.key === "Enter" && addStage()} />
          <button className="cn-btn-ghost" onClick={addStage}><Plus size={14} /> Add stage</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== CAREER FILES ============================== */
function CareerFilesPage({ resumes, openAddResume, updateResume }) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [busyId, setBusyId] = useState(null);

  function startRename(r) { setRenamingId(r.id); setRenameVal(r.name); }
  async function commitRename(id) {
    if (renameVal.trim()) await updateResume(id, { name: renameVal.trim() });
    setRenamingId(null);
  }
  async function getSignedUrl(r, download = false) {
    if (!r.filePath) {
      alert("This resume does not have a cloud file path yet.");
      return null;
    }
    const options = download ? { download: r.fileName || "resume.pdf" } : {};
    const { data, error } = await supabase.storage.from("resumes").createSignedUrl(
      r.filePath,
      300,
      options
    );
    if (error) {
      console.error("Resume signed URL error:", error);
      alert("Could not open the resume: " + error.message);
      return null;
    }
    return data?.signedUrl || null;
  }
  async function viewResume(r) {
    setBusyId(r.id);
    const url = await getSignedUrl(r, false);
    setBusyId(null);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }
  async function downloadResume(r) {
    setBusyId(r.id);
    const url = await getSignedUrl(r, true);
    setBusyId(null);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = r.fileName || "resume.pdf";
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="cn-serif text-2xl">Career Files</p>
        <button className="cn-btn-gold" onClick={openAddResume}><Plus size={15} /> Add Resume</button>
      </div>

      {resumes.length === 0 ? (
        <EmptyState title="No resumes added yet" body="Upload your first resume to start linking it to applications." actionLabel="Add Resume" onAction={openAddResume} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resumes.map(r => (
            <div key={r.id} className="cn-card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                {renamingId === r.id ? (
                  <input className="cn-input" autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => commitRename(r.id)} onKeyDown={e => e.key === "Enter" && commitRename(r.id)} />
                ) : (
                  <p className="text-sm font-medium">{r.name}</p>
                )}
                <FileText size={16} style={{ color: "var(--text-faint)" }} className="shrink-0" />
              </div>
              <Pill text={r.category.replace("Software / ", "")} style={CATEGORY_STYLE[r.category]} />
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                {r.fileName || "No file attached"} · Added {fmtDate(r.createdAt)}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {r.filePath && (
                  <>
                    <button className="cn-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => viewResume(r)} disabled={busyId === r.id}>
                      <Eye size={13} /> {busyId === r.id ? "Opening…" : "View"}
                    </button>
                    <button className="cn-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => downloadResume(r)} disabled={busyId === r.id}>
                      <Download size={13} /> Download
                    </button>
                  </>
                )}
                <button className="cn-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => startRename(r)}><Pencil size={13} /> Rename</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== ARCHIVE ============================== */
function ArchivePage({ applications, resumes, restoreApp, openApp }) {
  const archived = applications.filter(a => a.archivedAt);
  const resumeName = (id) => resumes.find(r => r.id === id)?.name;

  return (
    <div className="flex flex-col gap-5">
      <p className="cn-serif text-2xl">Archive</p>
      {archived.length === 0 ? (
        <EmptyState title="No archived applications" body="Applications you archive — rejected, withdrawn, or completed — will show up here." />
      ) : (
        <div className="flex flex-col gap-2">
          {archived.map(a => (
            <div key={a.id} className="cn-card px-5 py-4 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] gap-3 md:items-center">
              <div className="min-w-0 cursor-pointer" onClick={() => openApp(a.id)}>
                <p className="text-sm font-medium truncate">{a.companyName}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.jobRole}</p>
              </div>
              <div><Pill text={a.status} style={STATUS_STYLE[a.status]} /></div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Applied {fmtDate(a.appliedDate)}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{resumeName(a.resumeId) || "No resume"} · Archived {fmtDate(a.archivedAt)}</div>
              <div className="flex gap-2 md:justify-end">
                <button className="cn-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => restoreApp(a.id)}><RotateCcw size={13} /> Restore</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== PROFILE ============================== */
function ProfilePage({ profile, setProfile, data, onImport }) {
  const set = (k, v) => setProfile({ ...profile, [k]: v });

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "careernest-backup.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        onImport(parsed);
      } catch { alert("That file doesn't look like a valid CareerNest backup."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <p className="cn-serif text-2xl">Profile</p>

      <div className="cn-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="cn-label">Name</label><input className="cn-input" value={profile.name} onChange={e => set("name", e.target.value)} placeholder="Your name" /></div>
        <div><label className="cn-label">Email (optional)</label><input className="cn-input" value={profile.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" /></div>
        <div><label className="cn-label">Phone (optional)</label><input className="cn-input" value={profile.phone} onChange={e => set("phone", e.target.value)} /></div>
        <div><label className="cn-label">Location</label><input className="cn-input" value={profile.location} onChange={e => set("location", e.target.value)} /></div>
        <div>
          <label className="cn-label">Preferred career category</label>
          <select className="cn-input" value={profile.preferredCategory || ""} onChange={e => set("preferredCategory", e.target.value)}>
            <option value="">No preference</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cn-label">Experience level</label>
          <select className="cn-input" value={profile.experienceLevel} onChange={e => set("experienceLevel", e.target.value)}>
            {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="cn-card p-6">
        <p className="text-sm font-medium mb-1">Theme</p>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Switch between the dark gold theme and a light surface.</p>
        <div className="flex gap-2">
          <button className={profile.theme === "dark" ? "cn-btn-gold" : "cn-btn-ghost"} onClick={() => set("theme", "dark")}>Dark</button>
          <button className={profile.theme === "light" ? "cn-btn-gold" : "cn-btn-ghost"} onClick={() => set("theme", "light")}>Light</button>
        </div>
      </div>

      <div className="cn-card p-6">
        <p className="text-sm font-medium mb-1">Notification preferences</p>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Reminders for interviews and follow-ups are coming in a future version.</p>
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-faint)" }}>
          <input type="checkbox" disabled /> Email reminders (coming soon)
        </label>
      </div>

      <div className="cn-card p-6">
        <p className="text-sm font-medium mb-1">Data backup</p>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>CareerNest is local-first — export your data as a backup, or import a previous one.</p>
        <div className="flex flex-wrap gap-2">
          <button className="cn-btn-ghost" onClick={exportData}><Download size={14} /> Export Career Data</button>
          <label className="cn-btn-ghost" style={{ cursor: "pointer" }}>
            <Upload size={14} /> Import Career Data
            <input type="file" accept="application/json" onChange={handleImportFile} style={{ display: "none" }} />
          </label>
        </div>
      </div>
    </div>
  );
}

/* ============================== APP ============================== */
function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage("Password reset link sent. Check your email and open the link to set a new password.");
        }
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setError(error.message);
        } else if (data?.session) {
          setMessage("Account created successfully. Welcome to CareerNest!");
        } else {
          setMessage("Account created. Please check your email and confirm your account before signing in.");
          setMode("login");
          setPassword("");
          setConfirmPassword("");
        }
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">CareerNest</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isSignup ? "Create your own career space." : isForgot ? "Reset your CareerNest password." : "Your Career. One Home."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {!isForgot && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm text-zinc-300">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-yellow-400 hover:text-yellow-300"
                    onClick={() => switchMode("forgot")}
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none"
                placeholder={isSignup ? "Create a password (6+ characters)" : "Enter your password"}
                disabled={loading}
              />
            </div>
          )}

          {isSignup && (
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none"
                placeholder="Re-enter your password"
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-medium text-black disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignup ? "Create account" : isForgot ? "Send reset link" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {isForgot ? (
            <button type="button" className="text-yellow-400 hover:text-yellow-300" onClick={() => switchMode("login")}>
              ← Back to sign in
            </button>
          ) : isLogin ? (
            <p>
              New to CareerNest?{" "}
              <button type="button" className="text-yellow-400 hover:text-yellow-300" onClick={() => switchMode("signup")}>
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button type="button" className="text-yellow-400 hover:text-yellow-300" onClick={() => switchMode("login")}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPage({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated successfully. You can now sign in with your new password.");
    setPassword("");
    setConfirmPassword("");

    setTimeout(async () => {
      await supabase.auth.signOut();
      onDone();
    }, 900);
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Set New Password</h1>
          <p className="mt-2 text-sm text-zinc-400">Choose a new password for your CareerNest account.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none"
              placeholder="Enter new password"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none"
              placeholder="Re-enter new password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-medium text-black disabled:opacity-50">
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", location: "", experienceLevel: EXPERIENCE_LEVELS[0], theme: "dark", preferredCategory: "" });
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [page, setPage] = useState("home");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [showAddResume, setShowAddResume] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    (async () => {
      const localData = await loadData(session.user.id);

      const { data: cloudApplications, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Supabase application load error:", error);
        alert("Could not load applications from Supabase: " + error.message);
        setApplications([]);
      } else {
        const mappedApplications = (cloudApplications || []).map((a) => ({
          id: a.id,
          companyName: a.company_name,
          jobRole: a.job_role,
          category: a.category,
          appliedDate: a.applied_date,
          location: a.location || "",
          workType: a.work_type || "",
          salary: a.salary || "",
          applicationSource: a.application_source || "",
          jobLink: a.job_link || "",
          resumeId: a.resume_id || null,
          status: a.status || "In Progress",
          notes: a.notes || "",
          createdAt: a.created_at,
          updatedAt: a.updated_at,
          archivedAt: a.archived_at || null,
          stages: makeStages(a.category),
        }));

        setApplications(mappedApplications);
      }

      setProfile({
        preferredCategory: "",
        ...(localData?.profile || {}),
      });

      const { data: cloudResumes, error: resumeError } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (resumeError) {
        console.error("Supabase resume load error:", resumeError);
        alert("Could not load resumes from Supabase: " + resumeError.message);
        setResumes([]);
      } else {
        const mappedResumes = (cloudResumes || []).map((r) => ({
          id: r.id,
          name: r.name || "Unnamed resume",
          category: r.category || "Software / IT",
          fileName: r.file_name || "resume.pdf",
          filePath: r.file_path || "",
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));
        setResumes(mappedResumes);
      }
      setLoaded(true);
    })();

    return () => { cancelled = true; };
  }, [session]);

  useEffect(() => {
    if (!loaded) return;
    saveData(session?.user?.id, { profile, applications, resumes });
  }, [profile, applications, resumes, loaded, session?.user?.id]);

  const updateApplication = useCallback(async (id, patch) => {
    const dbPatch = {};

    if (Object.prototype.hasOwnProperty.call(patch, "companyName")) dbPatch.company_name = patch.companyName.trim();
    if (Object.prototype.hasOwnProperty.call(patch, "jobRole")) dbPatch.job_role = patch.jobRole.trim();
    if (Object.prototype.hasOwnProperty.call(patch, "category")) dbPatch.category = patch.category;
    if (Object.prototype.hasOwnProperty.call(patch, "appliedDate")) dbPatch.applied_date = patch.appliedDate;
    if (Object.prototype.hasOwnProperty.call(patch, "location")) dbPatch.location = patch.location;
    if (Object.prototype.hasOwnProperty.call(patch, "workType")) dbPatch.work_type = patch.workType;
    if (Object.prototype.hasOwnProperty.call(patch, "salary")) dbPatch.salary = patch.salary;
    if (Object.prototype.hasOwnProperty.call(patch, "applicationSource")) dbPatch.application_source = patch.applicationSource;
    if (Object.prototype.hasOwnProperty.call(patch, "jobLink")) dbPatch.job_link = patch.jobLink;
    if (Object.prototype.hasOwnProperty.call(patch, "resumeId")) dbPatch.resume_id = patch.resumeId || null;
    if (Object.prototype.hasOwnProperty.call(patch, "status")) dbPatch.status = patch.status;
    if (Object.prototype.hasOwnProperty.call(patch, "notes")) dbPatch.notes = patch.notes;
    if (Object.prototype.hasOwnProperty.call(patch, "archivedAt")) dbPatch.archived_at = patch.archivedAt || null;

    if (Object.keys(dbPatch).length > 0) {
      dbPatch.updated_at = nowISO();

      const { data, error } = await supabase
        .from("applications")
        .update(dbPatch)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase application update error:", error);
        alert("Could not save application changes: " + error.message);
        return false;
      }

      const cloudPatch = {
        companyName: data.company_name,
        jobRole: data.job_role,
        category: data.category,
        appliedDate: data.applied_date,
        location: data.location || "",
        workType: data.work_type || "",
        salary: data.salary || "",
        applicationSource: data.application_source || "",
        jobLink: data.job_link || "",
        resumeId: data.resume_id || null,
        status: data.status || "In Progress",
        notes: data.notes || "",
        updatedAt: data.updated_at,
        archivedAt: data.archived_at || null,
      };

      setApplications(prev => prev.map(a => a.id === id ? { ...a, ...cloudPatch } : a));
      return true;
    }

    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch, updatedAt: nowISO() } : a));
    return true;
  }, []);
  const addApplication = useCallback(async (form) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in again.");
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        company_name: form.companyName.trim(),
        job_role: form.jobRole.trim(),
        category: form.category,
        applied_date: form.appliedDate,
        location: form.location,
        work_type: form.workType,
        salary: form.salary,
        application_source: form.applicationSource,
        job_link: form.jobLink,
        resume_id: form.resumeId || null,
        status: "In Progress",
        notes: form.notes,
        archived_at: null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase application insert error:", error);
      alert("Could not save application: " + error.message);
      return;
    }

    const app = {
      id: data.id,
      companyName: data.company_name,
      jobRole: data.job_role,
      category: data.category,
      appliedDate: data.applied_date,
      location: data.location,
      workType: data.work_type,
      salary: data.salary,
      applicationSource: data.application_source,
      jobLink: data.job_link,
      resumeId: data.resume_id,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      archivedAt: data.archived_at,
      stages: makeStages(form.category),
    };

    setApplications(prev => [app, ...prev]);
    setSelectedId(app.id);
    setApplicationStatusFilter("All");
    setPage("applications");
  }, []);
  const addResume = useCallback(async (form) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in again.");
      return false;
    }
    if (!form.file) {
      alert("Please select a PDF resume.");
      return false;
    }

    const safeName = form.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${uid()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, form.file, {
        cacheControl: "3600",
        upsert: false,
        contentType: form.file.type || "application/pdf",
      });

    if (uploadError) {
      console.error("Supabase resume upload error:", uploadError);
      alert("Could not upload resume: " + uploadError.message);
      return false;
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        name: form.name,
        category: form.category,
        file_name: form.file.name,
        file_path: filePath,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase resume metadata error:", error);
      alert("The file uploaded, but its resume record could not be saved: " + error.message);
      return false;
    }

    const r = {
      id: data.id,
      name: data.name,
      category: data.category,
      fileName: data.file_name,
      filePath: data.file_path,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
    setResumes(prev => [r, ...prev]);
    return true;
  }, []);

  const updateResume = useCallback(async (id, patch) => {
    const dbPatch = {};
    if (Object.prototype.hasOwnProperty.call(patch, "name")) dbPatch.name = patch.name.trim();
    if (Object.prototype.hasOwnProperty.call(patch, "category")) dbPatch.category = patch.category;
    if (Object.keys(dbPatch).length === 0) return true;

    dbPatch.updated_at = nowISO();
    const { data, error } = await supabase
      .from("resumes")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase resume update error:", error);
      alert("Could not save resume changes: " + error.message);
      return false;
    }

    setResumes(prev => prev.map(r => r.id === id ? {
      ...r,
      name: data.name,
      category: data.category,
      updatedAt: data.updated_at,
    } : r));
    return true;
  }, []);
  function importAll(parsed) {
    if (!confirm("Import this backup? It will replace your current CareerNest data.")) return;
    setProfile({ preferredCategory: "", ...(parsed.profile || {}) });
    setApplications(parsed.applications || []);
    setResumes(parsed.resumes || []);
  }

  const selectedApp = applications.find(a => a.id === selectedId);

  function openApp(id) { setSelectedId(id); setPage("detail"); setMobileMenu(false); }
  function goPage(p, status) {
    if (p === "applications") setApplicationStatusFilter(status || "All");
    setPage(p);
    setMobileMenu(false);
  }
  function openAddApplication() {
    setApplicationStatusFilter("All");
    setPage("add-application");
    setMobileMenu(false);
  }
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase sign out error:", error);
      alert("Could not sign out: " + error.message);
    }
  }
  if (recoveryMode) return <ResetPasswordPage onDone={() => setRecoveryMode(false)} />;
  if (!session) return <LoginPage />;
  if (!loaded) {
    return (
      <div className="cn-root flex items-center justify-center h-screen">
        <style>{THEME_CSS}</style>
        <NestLogo variant="loading" />
      </div>
    );
  }

  return (
    <div className={"cn-root " + (profile.theme === "light" ? "light" : "")}>
      <style>{THEME_CSS}</style>
      <div className="flex">
        <Sidebar page={page} setPage={goPage} onAdd={openAddApplication} onLogout={handleLogout} />

        <div className="flex-1 min-w-0">
          <div className="md:hidden flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <NestLogo variant="mobile" />
            <div className="flex items-center gap-2">
              <button className="cn-btn-gold" style={{ padding: "8px 12px" }} onClick={openAddApplication} title="Add Application" aria-label="Add Application"><Plus size={14} /></button>
              <button className="cn-btn-ghost" style={{ padding: "8px 10px", color: "var(--red)" }} onClick={handleLogout} title="Sign out" aria-label="Sign out"><LogOut size={15} /></button>
            </div>
          </div>

          <main className="cn-page-main min-h-screen px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-10 max-w-7xl">
            {page === "home" && <HomePage applications={applications} resumes={resumes} profile={profile} setProfile={setProfile} session={session} setPage={goPage} openAdd={openAddApplication} />}
            {page === "applications" && <ApplicationsPage applications={applications} resumes={resumes} openApp={openApp} openAdd={openAddApplication} openEdit={(id) => { setSelectedId(id); setPage("edit-application"); setMobileMenu(false); }} setPage={goPage} initialStatus={applicationStatusFilter} />}
            {page === "add-application" && <AddApplicationPage onClose={() => goPage("applications")} onSave={addApplication} resumes={resumes} />}
            {page === "edit-application" && selectedApp && (
              <EditApplicationPage
                app={selectedApp}
                resumes={resumes}
                onClose={() => goPage("applications")}
                onSave={async (patch) => {
                  const ok = await updateApplication(selectedApp.id, patch);
                  if (ok) goPage("applications");
                  return ok;
                }}
              />
            )}
            {page === "detail" && selectedApp && (
              <ApplicationDetail
                app={selectedApp}
                resumes={resumes}
                updateApp={(patch) => updateApplication(selectedApp.id, patch)}
                archiveApp={() => { updateApplication(selectedApp.id, { archivedAt: nowISO() }); goPage("archive"); }}
                restoreApp={() => updateApplication(selectedApp.id, { archivedAt: null })}
                openEdit={() => { setPage("edit-application"); setMobileMenu(false); }}
                back={() => goPage("applications")}
              />
            )}
            {page === "files" && <CareerFilesPage resumes={resumes} openAddResume={() => setShowAddResume(true)} updateResume={updateResume} />}
            {page === "archive" && <ArchivePage applications={applications} resumes={resumes} restoreApp={(id) => updateApplication(id, { archivedAt: null })} openApp={openApp} />}
            {page === "profile" && <ProfilePage profile={profile} setProfile={setProfile} data={{ profile, applications, resumes }} onImport={importAll} />}
          </main>
        </div>
      </div>

      <BottomNav page={page} setPage={goPage} />

      {showAddResume && <AddResumeModal onClose={() => setShowAddResume(false)} onSave={addResume} />}
    </div>
  );
}
