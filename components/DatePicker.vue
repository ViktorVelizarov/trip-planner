<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !value && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value.start">
          <template v-if="value.end">
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
          </template>

          <template v-else>
            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else>
          Pick a date
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
        v-model="value"
        initial-focus
        :number-of-months="2"
        :placeholder="value?.start"
        @update:start-value="(startDate) => { value.start = startDate; updateSelectedDateRange() }"
        @update:end-value="(endDate) => { value.end = endDate; updateSelectedDateRange() }"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { type Ref, ref, defineProps, defineEmits } from 'vue'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const emits = defineEmits(['update:selectedDateRange'])

const value = ref({
  start: new CalendarDate(2024, 1, 1),
  end: new CalendarDate(2024, 1, 1).add({ days: 5 }),
}) as Ref<{ start: CalendarDate, end: CalendarDate }>

const updateSelectedDateRange = () => {
  const start = value.value.start;
  const end = value.value.end;

  emits('update:selectedDateRange', start, end);
}
</script>
