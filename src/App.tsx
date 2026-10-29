/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { HomeView } from './components/HomeView';
import { AddWasteForm } from './components/AddWasteForm';
import { AddWasteModal } from './components/AddWasteModal';
import { TipsAndGuideView } from './components/TipsAndGuideView';
import { DisposalSettingsView } from './components/DisposalSettingsView';
import { DisposalCelebrationModal } from './components/DisposalCelebrationModal';
import { DisposalEvent, DisposalSettings, WasteRecord } from './types';
import {
  getInitialData,
  saveRecords,
  saveHistory,
  saveSettings,
  saveLastDisposalDate,
  calculateDaysElapsed
} from './utils/storage';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [history, setHistory] = useState<DisposalEvent[]>([]);
  const [settings, setSettings] = useState<DisposalSettings>(() => getInitialData().settings);
  const [lastDisposalDate, setLastDisposalDate] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<'home' | 'record' | 'tips' | 'settings'>('home');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isDisposalModalOpen, setIsDisposalModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const initial = getInitialData();
    setRecords(initial.records);
    setHistory(initial.history);
    setSettings(initial.settings);
    setLastDisposalDate(initial.lastDisposalDate);
    setDataLoaded(true);
  }, []);

  const daysElapsed = calculateDaysElapsed(lastDisposalDate);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleAddRecord = (recordData: Omit<WasteRecord, 'id' | 'timestamp'>) => {
    const newRecord: WasteRecord = {
      ...recordData,
      id: `waste-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    saveRecords(updated);
    showToast(`"${newRecord.categoryLabel}" 기록이 추가되었습니다!`);
    setCurrentTab('home');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveRecords(updated);
    showToast('기록이 삭제되었습니다.');
  };

  const handleConfirmDisposal = (note?: string) => {
    const now = new Date();
    const totalGrams = records.reduce((sum, r) => sum + r.estimatedGrams, 0);

    const newEvent: DisposalEvent = {
      id: `disp-${now.getTime()}`,
      timestamp: now.toISOString(),
      daysElapsed: daysElapsed,
      totalGrams: totalGrams,
      itemCount: records.length,
      bagSizeLiters: settings.bagCapacityLiters,
      note: note || undefined
    };

    const updatedHistory = [newEvent, ...history];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);

    // Empty records and reset D-day
    setRecords([]);
    saveRecords([]);

    const todayIso = now.toISOString();
    setLastDisposalDate(todayIso);
    saveLastDisposalDate(todayIso);

    setIsDisposalModalOpen(false);
    showToast('🎉 배출 완료! D+0일로 리셋되었습니다.');
  };

  const handleSaveSettings = (newSettings: DisposalSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast('동네 배출 설정이 저장되었습니다.');
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
    showToast('배출 히스토리가 비워졌습니다.');
  };

  const handleAdjustDaysElapsed = (newDays: number) => {
    const now = new Date();
    const simulatedDate = new Date(now.getTime() - newDays * 24 * 60 * 60 * 1000);
    const iso = simulatedDate.toISOString();
    setLastDisposalDate(iso);
    saveLastDisposalDate(iso);
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] text-[#557062]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#2D7A50] border-t-transparent animate-spin" />
          <span className="text-xs font-medium">소담쓰레기 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#2C3E35] flex flex-col font-sans selection:bg-[#D5E6DC] selection:text-[#1E3329]">
      {/* Toast message popup */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1E3329] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#5EDB92]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header conforming to Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onQuickAdd={() => setIsRecordModalOpen(true)}
        daysElapsed={daysElapsed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-6">
        {currentTab === 'home' && (
          <HomeView
            records={records}
            daysElapsed={daysElapsed}
            lastDisposalDate={lastDisposalDate}
            settings={settings}
            onOpenRecordModal={() => setIsRecordModalOpen(true)}
            onOpenDisposalModal={() => setIsDisposalModalOpen(true)}
            onDeleteRecord={handleDeleteRecord}
            onAdjustDaysElapsed={handleAdjustDaysElapsed}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'record' && (
          <div className="py-2">
            <AddWasteForm
              onSaveRecord={handleAddRecord}
              onCancel={() => setCurrentTab('home')}
            />
          </div>
        )}

        {currentTab === 'tips' && <TipsAndGuideView />}

        {currentTab === 'settings' && (
          <DisposalSettingsView
            settings={settings}
            history={history}
            onSaveSettings={handleSaveSettings}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Tab Bar */}
      <BottomTabBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        daysElapsed={daysElapsed}
      />

      {/* Record Addition Modal */}
      <AddWasteModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSaveRecord={handleAddRecord}
      />

      {/* Disposal Completion Celebration Modal */}
      <DisposalCelebrationModal
        isOpen={isDisposalModalOpen}
        onClose={() => setIsDisposalModalOpen(false)}
        onConfirm={handleConfirmDisposal}
        daysElapsed={daysElapsed}
        records={records}
      />
    </div>
  );
}
