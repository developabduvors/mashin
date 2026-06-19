'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, saveCarImages } from '@/lib/api';
import type {
  AdminCar,
  BrandWithModels,
  BodyType,
  Condition,
  FuelType,
  Transmission,
  CarFormPayload,
} from '@/lib/types';

// Enum -> o'zbekcha yorliqlar (select optionlari). Qiymatlar backend zod enum'iga mos.
const CONDITION: Record<Condition, string> = { NEW: 'Yangi', USED: 'Ishlatilgan' };
const BODY: Record<BodyType, string> = {
  SEDAN: 'Sedan', SUV: 'SUV', HATCHBACK: 'Xetchbek',
  CROSSOVER: 'Krossover', MINIVAN: 'Miniven', COUPE: 'Kupe',
};
const FUEL: Record<FuelType, string> = {
  PETROL: 'Benzin', DIESEL: 'Dizel', HYBRID: 'Gibrid', ELECTRIC: 'Elektr', GAS: 'Gaz',
};
const TRANSMISSION: Record<Transmission, string> = {
  MT: 'Mexanika', AT: 'Avtomat', CVT: 'Variator', ROBOT: 'Robot',
};

interface ImageRow {
  url: string;
  isCover: boolean;
}

interface Props {
  mode: 'create' | 'edit';
  initial?: AdminCar; // edit rejimida to'ldiriladi
}

// Bo'sh stringni undefined'ga; raqamli stringni number'ga o'giruvchi yordamchilar.
function numOrUndef(v: string): number | undefined {
  if (v.trim() === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function CarForm({ mode, initial }: Props) {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandWithModels[]>([]);

  // Forma holati — barcha maydonlar string (input/select uchun qulay).
  const [brandId, setBrandId] = useState(initial?.brandId ?? '');
  const [modelId, setModelId] = useState(initial?.modelId ?? '');
  const [trim, setTrim] = useState(initial?.trim ?? '');
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [condition, setCondition] = useState<Condition>(initial?.condition ?? 'NEW');
  const [bodyType, setBodyType] = useState<BodyType>(initial?.bodyType ?? 'SEDAN');
  const [fuelType, setFuelType] = useState<FuelType>(initial?.fuelType ?? 'PETROL');
  const [transmission, setTransmission] = useState<Transmission>(initial?.transmission ?? 'AT');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [monthlyFrom, setMonthlyFrom] = useState(initial?.monthlyFrom ?? '');
  const [mileage, setMileage] = useState(initial?.mileage != null ? String(initial.mileage) : '');
  const [hasPts, setHasPts] = useState(initial?.hasPts ?? false);
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [images, setImages] = useState<ImageRow[]>(
    initial?.images.length
      ? initial.images.map((i) => ({ url: i.url, isCover: i.isCover }))
      : [{ url: '', isCover: true }],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Brand/modellarni public endpoint orqali yuklaymiz (auth shart emas).
  useEffect(() => {
    api.brands
      .getAll()
      .then(setBrands)
      .catch((e) => setError((e as Error).message));
  }, []);

  // Tanlangan brand modellariga ko'ra model ro'yxati.
  const models = useMemo(
    () => brands.find((b) => b.id === brandId)?.models ?? [],
    [brands, brandId],
  );

  // Brand o'zgarsa — model boshqa brandga tegishli bo'lmasa tozalaymiz.
  function onBrandChange(id: string) {
    setBrandId(id);
    const stillValid = brands.find((b) => b.id === id)?.models.some((m) => m.id === modelId);
    if (!stillValid) setModelId('');
  }

  // Rasm qatori boshqaruvi.
  function setImageUrl(idx: number, url: string) {
    setImages((prev) => prev.map((r, i) => (i === idx ? { ...r, url } : r)));
  }
  function setCover(idx: number) {
    setImages((prev) => prev.map((r, i) => ({ ...r, isCover: i === idx })));
  }
  function addImageRow() {
    setImages((prev) => [...prev, { url: '', isCover: prev.length === 0 }]);
  }
  function removeImageRow(idx: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // Cover o'chirilsa — birinchisini cover qilamiz.
      if (next.length && !next.some((r) => r.isCover)) next[0].isCover = true;
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!brandId || !modelId) {
      setError('Brand va modelni tanlang.');
      return;
    }
    const priceNum = numOrUndef(price);
    if (priceNum === undefined) {
      setError("Narxni to'g'ri kiriting.");
      return;
    }

    const payload: CarFormPayload = {
      brandId,
      modelId,
      trim: trim.trim(),
      year: Number(year),
      condition,
      bodyType,
      fuelType,
      transmission,
      price: priceNum,
      monthlyFrom: numOrUndef(monthlyFrom),
      mileage: numOrUndef(mileage),
      hasPts,
      inStock,
      isFeatured,
      description: description.trim() || undefined,
    };

    // Bo'sh URL'larni tashlab, faqat haqiqiy rasmlarni saqlaymiz.
    const cleanImages = images.filter((r) => r.url.trim());
    if (cleanImages.length && !cleanImages.some((r) => r.isCover)) {
      cleanImages[0].isCover = true;
    }

    setSaving(true);
    try {
      if (mode === 'create') {
        const car = await api.admin.cars.create(payload);
        await saveCarImages(car.id, cleanImages);
      } else if (initial) {
        await api.admin.cars.update(initial.id, payload);
        await saveCarImages(initial.id, cleanImages, initial.images);
      }
      router.push('/admin/cars');
    } catch (err) {
      setError((err as Error).message);
      setSaving(false); // xatoda formada qolamiz
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      {error && (
        <p className="mb-6 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* Brand / Model */}
      <Section title="Asosiy">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Brand *" value={brandId} onChange={onBrandChange} required>
            <option value="">— tanlang —</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Select>
          <Select
            label="Model *"
            value={modelId}
            onChange={setModelId}
            required
            disabled={!brandId}
          >
            <option value="">{brandId ? '— tanlang —' : 'avval brand'}</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
          <Field label="Komplektatsiya (trim) *">
            <input
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              required
              placeholder="masalan: Comfort 1.6 AT"
              className={inputCls}
            />
          </Field>
          <Field label="Yil *">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min={1950}
              max={2100}
              required
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* Texnik */}
      <Section title="Texnik xususiyatlar">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Holati" value={condition} onChange={(v) => setCondition(v as Condition)}>
            {Object.entries(CONDITION).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
          <Select label="Kuzov turi" value={bodyType} onChange={(v) => setBodyType(v as BodyType)}>
            {Object.entries(BODY).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
          <Select label="Yoqilg'i" value={fuelType} onChange={(v) => setFuelType(v as FuelType)}>
            {Object.entries(FUEL).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
          <Select
            label="Uzatma"
            value={transmission}
            onChange={(v) => setTransmission(v as Transmission)}
          >
            {Object.entries(TRANSMISSION).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
          <Field label="Probeg (km)">
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              min={0}
              placeholder="0"
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* Narx */}
      <Section title="Narx">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Narx (so'm) *">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              required
              placeholder="250000000"
              className={inputCls}
            />
          </Field>
          <Field label="Oyiga (boshlang'ich, so'm)">
            <input
              type="number"
              value={monthlyFrom}
              onChange={(e) => setMonthlyFrom(e.target.value)}
              min={0}
              placeholder="ixtiyoriy"
              className={inputCls}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <Check label="Sotuvda" checked={inStock} onChange={setInStock} />
          <Check label="PTS bor" checked={hasPts} onChange={setHasPts} />
          <Check label="Tavsiya etilgan (featured)" checked={isFeatured} onChange={setIsFeatured} />
        </div>
      </Section>

      {/* Tavsif */}
      <Section title="Tavsif">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Mashina haqida qo'shimcha ma'lumot..."
          className={`${inputCls} h-auto py-2`}
        />
      </Section>

      {/* Rasmlar */}
      <Section title="Rasmlar (URL)">
        <p className="mb-3 text-xs text-zinc-500">
          Rasm URL manzilini kiriting. Asosiy (cover) rasmni belgilang — u ro&apos;yxatda ko&apos;rinadi.
        </p>
        <div className="flex flex-col gap-3">
          {images.map((row, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                value={row.url}
                onChange={(e) => setImageUrl(idx, e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
              <label className="flex flex-shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-600">
                <input
                  type="radio"
                  name="cover"
                  checked={row.isCover}
                  onChange={() => setCover(idx)}
                />
                Asosiy
              </label>
              <button
                type="button"
                onClick={() => removeImageRow(idx)}
                className="flex-shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                O&apos;chir
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImageRow}
          className="mt-3 rounded-md border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
        >
          + Rasm qo&apos;shish
        </button>
      </Section>

      {/* Amallar */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A00F19] disabled:opacity-50"
        >
          {saving ? 'Saqlanmoqda...' : mode === 'create' ? 'Qo‘shish' : 'Saqlash'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/cars')}
          className="rounded-md border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Bekor qilish
        </button>
      </div>
    </form>
  );
}

// ── Kichik UI yordamchilari (forma ichida ishlatiladi) ──

const inputCls =
  'flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 disabled:opacity-50 disabled:bg-zinc-50';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-8">
      <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      {children}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={inputCls}
      >
        {children}
      </select>
    </Field>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-300"
      />
      {label}
    </label>
  );
}
