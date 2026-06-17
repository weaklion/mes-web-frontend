<template>
  <main
    class="grid min-h-screen grid-cols-1 bg-slate-100 text-slate-900 lg:grid-cols-[248px_1fr]"
  >
    <aside
      class="flex gap-7 bg-slate-900 px-[18px] py-6 text-slate-50 lg:min-h-screen lg:flex-col"
    >
      <div class="flex items-center gap-3">
        <Factory :size="28" />
        <div>
          <strong class="block">Web MES</strong>
          <span class="block text-[13px] text-slate-300">Process Control</span>
        </div>
      </div>

      <nav class="grid gap-2">
        <button
          :class="[
            'flex min-h-10 items-center gap-2.5 rounded-md px-3 text-left transition hover:bg-slate-700 hover:text-white',
            activeTab === 'monitoring'
              ? 'bg-slate-700 text-white'
              : 'text-slate-300',
          ]"
          @click="selectTab('monitoring')"
        >
          <Activity :size="18" />
          Monitoring
        </button>
        <button
          :class="[
            'flex min-h-10 items-center gap-2.5 rounded-md px-3 text-left transition hover:bg-slate-700 hover:text-white',
            activeTab === 'master'
              ? 'bg-slate-700 text-white'
              : 'text-slate-300',
          ]"
          @click="selectTab('master')"
        >
          <Database :size="18" />
          Master Data
        </button>
      </nav>

      <div class="mt-auto flex items-center gap-2 text-[13px] text-slate-300">
        <span
          :class="
            mode === 'api'
              ? 'h-[9px] w-[9px] rounded-full bg-emerald-500'
              : 'h-[9px] w-[9px] rounded-full bg-amber-500'
          "
        />
        {{ connectionText }}
      </div>
    </aside>

    <section v-if="activeTab === 'monitoring'" class="p-7">
      <header
        class="mb-[22px] flex flex-col items-start justify-between gap-5 lg:flex-row"
      >
        <div>
          <h1 class="m-0 text-[28px] font-bold">Virtual Assembly Line MES</h1>
          <p class="mt-1.5 text-[13px] text-slate-500">
            C# WPF process-control logic rebuilt with Vue 3, TypeScript,
            Tailwind CSS, axios, and Spring Boot
          </p>
        </div>

        <div class="flex gap-2">
          <input
            class="h-10 w-[76px] rounded-md border border-slate-300 bg-white px-2.5"
            aria-label="Schedule ID"
            type="number"
            min="1"
            :value="selectedSchIdx"
            @change="onScheduleChange"
          />
          <button
            class="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-800 transition hover:bg-slate-50"
            title="Reset demo state"
            @click="resetDemo"
          >
            <RotateCcw :size="18" />
          </button>
          <button
            class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3 font-medium text-white transition hover:bg-blue-700"
            @click="startProcess"
          >
            <Play :size="18" />
            Start
          </button>
        </div>
      </header>

      <section
        class="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4"
      >
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <span class="block text-[13px] text-slate-500">Plant</span>
          <strong class="mt-2 block text-xl font-bold text-slate-900">{{
            summary.plantName
          }}</strong>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <span class="block text-[13px] text-slate-500">Facility</span>
          <strong class="mt-2 block text-xl font-bold text-slate-900">{{
            summary.facilityName
          }}</strong>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <span class="block text-[13px] text-slate-500">Target</span>
          <strong class="mt-2 block text-xl font-bold text-slate-900">{{
            summary.schAmount
          }}</strong>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <span class="block text-[13px] text-slate-500">Success Rate</span>
          <strong class="mt-2 block text-xl font-bold text-emerald-700">{{
            summary.successRate
          }}</strong>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3.5 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-lg border border-slate-200 bg-white p-[18px]">
          <div class="mb-3.5 flex items-center justify-between gap-3">
            <h2 class="m-0 text-lg font-bold">Line Simulator</h2>
            <span class="text-[13px] text-slate-500">{{
              lineState.toUpperCase()
            }}</span>
          </div>

          <div :class="['factory-line', lineState]">
            <div class="factory-belt">
              <div class="factory-gear factory-gear--left" />
              <div class="factory-gear factory-gear--right" />
              <div class="factory-product" />
            </div>
            <div
              class="absolute right-[15%] top-11 grid justify-items-center gap-2"
            >
              <span class="h-[120px] w-2.5 rounded bg-slate-900" />
              <strong class="text-xs text-slate-600">Inspection Sensor</strong>
            </div>
          </div>

          <pre
            class="mt-3.5 min-h-[116px] overflow-auto rounded-lg bg-slate-900 p-3.5 text-slate-200"
            >{{
              JSON.stringify(
                controlMessage ?? { topic: "pknu/sf52/control", flag: "WAIT" },
                null,
                2,
              )
            }}</pre
          >
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-[18px]">
          <div class="mb-3.5 flex items-center justify-between gap-3">
            <h2 class="m-0 text-lg font-bold">Production Result</h2>
            <span class="text-[13px] text-slate-500"
              >schIdx #{{ summary.schIdx }}</span
            >
          </div>

          <div class="mb-4 grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-emerald-50 p-4 text-emerald-700">
              <span class="block">OK</span>
              <strong class="mt-1 block text-[32px]">{{
                summary.successAmount
              }}</strong>
            </div>
            <div class="rounded-lg bg-red-50 p-4 text-red-700">
              <span class="block">FAIL</span>
              <strong class="mt-1 block text-[32px]">{{
                summary.failAmount
              }}</strong>
            </div>
          </div>

          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                >
                  Time
                </th>
                <th
                  class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                >
                  Client
                </th>
                <th
                  class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                >
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event.id">
                <td class="border-b border-slate-200 px-2 py-3 text-left">
                  {{ event.inspection.timestamp }}
                </td>
                <td class="border-b border-slate-200 px-2 py-3 text-left">
                  {{ event.inspection.clientId }}
                </td>
                <td
                  class="border-b border-slate-200 px-2 py-3 text-left font-bold"
                  :class="
                    event.inspection.result === 'OK'
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  "
                >
                  {{ event.inspection.result }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>

    <section v-else class="p-7">
      <header class="mb-[22px] flex items-start justify-between gap-5">
        <div>
          <h1 class="m-0 text-[28px] font-bold">Master Data</h1>
          <p class="mt-1.5 text-[13px] text-slate-500">
            기준정보와 공정계획 데이터를 Spring API에서 조회합니다.
          </p>
        </div>
        <button
          class="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
          @click="loadMasterData"
        >
          Refresh
        </button>
      </header>

      <section class="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <div class="rounded-lg border border-slate-200 bg-white p-[18px]">
          <div class="mb-3.5 flex items-center justify-between gap-3">
            <h2 class="m-0 text-lg font-bold">Settings</h2>
            <span class="text-[13px] text-slate-500"
              >{{ settings.length }} rows</span
            >
          </div>

          <div class="overflow-auto">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                  >
                    Code
                  </th>
                  <th
                    class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                  >
                    Name
                  </th>
                  <th
                    class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="setting in settings" :key="setting.basicCode">
                  <td
                    class="border-b border-slate-200 px-2 py-3 font-mono text-xs text-slate-700"
                  >
                    {{ setting.basicCode }}
                  </td>
                  <td class="border-b border-slate-200 px-2 py-3 font-medium">
                    {{ setting.codeName }}
                  </td>
                  <td
                    class="border-b border-slate-200 px-2 py-3 text-slate-600"
                  >
                    {{ setting.codeDesc ?? "-" }}
                  </td>
                </tr>
                <tr v-if="settings.length === 0">
                  <td colspan="3" class="px-2 py-8 text-center text-slate-500">
                    Spring API 연결 후 기준정보가 표시됩니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-[18px]">
          <div class="mb-3.5 flex items-center justify-between gap-3">
            <h2 class="m-0 text-lg font-bold">Schedules</h2>
            <span class="text-[13px] text-slate-500"
              >{{ schedules.length }} rows</span
            >
          </div>

          <div class="overflow-auto">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                  >
                    ID
                  </th>
                  <th
                    class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                  >
                    Plant
                  </th>
                  <th
                    class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                  >
                    Facility
                  </th>
                  <th
                    class="border-b border-slate-200 px-2 py-3 text-left font-semibold text-slate-500"
                  >
                    Target
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="schedule in schedules" :key="schedule.schIdx">
                  <td
                    class="border-b border-slate-200 px-2 py-3 font-mono text-xs text-slate-700"
                  >
                    #{{ schedule.schIdx }}
                  </td>
                  <td class="border-b border-slate-200 px-2 py-3">
                    {{ schedule.plantCode }}
                  </td>
                  <td class="border-b border-slate-200 px-2 py-3">
                    {{ schedule.schFacilityId }}
                  </td>
                  <td class="border-b border-slate-200 px-2 py-3 font-semibold">
                    {{ schedule.schAmount }}
                  </td>
                </tr>
                <tr v-if="schedules.length === 0">
                  <td colspan="4" class="px-2 py-8 text-center text-slate-500">
                    Spring API 연결 후 공정계획이 표시됩니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Activity, Database, Factory, Play, RotateCcw } from "@lucide/vue";
import {
  buildControlMessage,
  formatDateTime,
  nextInspectionResult,
  type ControlMessage,
  type InspectionResult,
} from "../lib/mes-domain";
import { getJson, postJson } from "../lib/api";

type Mode = "api" | "demo";
type LineState = "idle" | "moving" | "ok" | "fail";
type ActiveTab = "monitoring" | "master";

interface MonitoringSummary {
  schIdx: number;
  plantCode: string;
  plantName: string;
  schDate: string;
  loadTime: number;
  facilityId: string;
  facilityName: string;
  schAmount: number;
  successAmount: number;
  failAmount: number;
  successRate: string;
}

interface InspectionPayload {
  schIdx: number;
  clientId: string;
  result: InspectionResult;
  timestamp: string;
}

interface ProductionEvent {
  id: string;
  control: ControlMessage;
  inspection: InspectionPayload;
}

interface Setting {
  basicCode: string;
  codeName: string;
  codeDesc: string | null;
  regDt: string | null;
  modDt: string | null;
}

interface Schedule {
  schIdx: number;
  plantCode: string;
  schDate: string;
  loadTime: number;
  schStartTime: string | null;
  schEndTime: string | null;
  schFacilityId: string;
  schAmount: number;
  regDt: string | null;
  modDt: string | null;
}

const demoSchedule: MonitoringSummary = {
  schIdx: 1,
  plantCode: "PLT01",
  plantName: "Assembly Plant A",
  schDate: new Date().toISOString().slice(0, 10),
  loadTime: 3,
  facilityId: "FAC01",
  facilityName: "Conveyor Inspector 01",
  schAmount: 20,
  successAmount: 0,
  failAmount: 0,
  successRate: "0.0 %",
};

const summary = ref<MonitoringSummary>({ ...demoSchedule });
const events = ref<ProductionEvent[]>([]);
const lineState = ref<LineState>("idle");
const activeTab = ref<ActiveTab>("monitoring");
const selectedSchIdx = ref(1);
const mode = ref<Mode>("demo");
const controlMessage = ref<ControlMessage | null>(null);
const settings = ref<Setting[]>([]);
const schedules = ref<Schedule[]>([]);

const connectionText = computed(() =>
  mode.value === "api" ? "Spring API connected" : "Demo mode",
);

async function loadSummary() {
  try {
    summary.value = await getJson<MonitoringSummary>(
      `/monitoring/${selectedSchIdx.value}`,
    );
    mode.value = "api";
  } catch {
    mode.value = "demo";
  }
}

async function loadMasterData() {
  try {
    const [nextSettings, nextSchedules] = await Promise.all([
      getJson<Setting[]>("/settings"),
      getJson<Schedule[]>("/schedules"),
    ]);
    settings.value = nextSettings;
    schedules.value = nextSchedules;
    mode.value = "api";
  } catch {
    mode.value = "demo";
  }
}

function selectTab(tab: ActiveTab) {
  activeTab.value = tab;
  if (tab === "monitoring") {
    loadSummary();
    return;
  }
  loadMasterData();
}

async function startProcess() {
  lineState.value = "moving";
  let message: ControlMessage;

  try {
    message = await postJson<ControlMessage>(
      `/monitoring/${selectedSchIdx.value}/start`,
    );
    mode.value = "api";
  } catch {
    message = buildControlMessage({
      clientId: "MON01",
      plantCode: summary.value.plantCode,
      facilityId: summary.value.facilityId,
      now: formatDateTime(),
    });
    mode.value = "demo";
  }

  controlMessage.value = message;
  window.setTimeout(
    () => finishInspection(message),
    summary.value.loadTime * 1000,
  );
}

async function finishInspection(message: ControlMessage) {
  const result = nextInspectionResult() as InspectionResult;
  const inspection: InspectionPayload = {
    schIdx: selectedSchIdx.value,
    clientId: "IOT01",
    result,
    timestamp: formatDateTime(),
  };

  try {
    summary.value = await postJson<MonitoringSummary, InspectionPayload>(
      "/simulator/inspection-results",
      inspection,
    );
    mode.value = "api";
  } catch {
    const successAmount =
      summary.value.successAmount + (result === "OK" ? 1 : 0);
    const failAmount = summary.value.failAmount + (result === "FAIL" ? 1 : 0);
    const total = successAmount + failAmount;

    summary.value = {
      ...summary.value,
      successAmount,
      failAmount,
      successRate: `${((successAmount * 100) / total).toFixed(1)} %`,
    };
    mode.value = "demo";
  }

  events.value = [
    {
      id: crypto.randomUUID(),
      control: message,
      inspection,
    },
    ...events.value,
  ].slice(0, 8);

  lineState.value = result === "OK" ? "ok" : "fail";
  window.setTimeout(() => {
    lineState.value = "idle";
  }, 900);
}

function resetDemo() {
  summary.value = { ...demoSchedule };
  events.value = [];
  controlMessage.value = null;
  lineState.value = "idle";
  mode.value = "demo";
}

function onScheduleChange(event: Event) {
  const input = event.target as HTMLInputElement;
  selectedSchIdx.value = Number(input.value);
  loadSummary();
}

onMounted(loadSummary);
</script>

<style scoped>
.factory-line {
  position: relative;
  display: grid;
  min-height: 310px;
  place-items: center;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: linear-gradient(180deg, #f1f5f9, #ffffff);
}

.factory-belt {
  position: relative;
  width: min(680px, 88%);
  height: 82px;
  border-radius: 6px;
  background: repeating-linear-gradient(
    90deg,
    #51606f,
    #51606f 24px,
    #64748b 24px,
    #64748b 42px
  );
  box-shadow: inset 0 -10px 0 rgba(0, 0, 0, 0.16);
}

.factory-product {
  position: absolute;
  top: 14px;
  left: 28px;
  width: 54px;
  height: 54px;
  border-radius: 6px;
  background: #8b5cf6;
  transition: background 180ms ease;
}

.factory-line.moving .factory-product {
  animation: move-product 3s linear forwards;
  background: #64748b;
}

.factory-line.ok .factory-product {
  left: calc(100% - 82px);
  background: #22c55e;
}

.factory-line.fail .factory-product {
  left: calc(100% - 82px);
  background: #ef4444;
}

.factory-gear {
  position: absolute;
  top: 15px;
  width: 52px;
  height: 52px;
  border: 8px solid #1e293b;
  border-radius: 50%;
  background: #e2e8f0;
}

.factory-gear--left {
  left: -26px;
}

.factory-gear--right {
  right: -26px;
}

@keyframes move-product {
  from {
    left: 28px;
  }
  to {
    left: calc(100% - 82px);
  }
}
</style>
