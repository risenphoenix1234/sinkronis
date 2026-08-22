"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type AvcStatus = "Active" | "Paused";

type AvcRecord = {
  id: number;
  employee: string;
  monthlyAvc: string;
  startDate: string;
  status: AvcStatus;
};

const initialAvcRecords: AvcRecord[] = [
  {
    id: 1,
    employee: "Chukwuemeka Adeyemi",
    monthlyAvc: "₦50,000",
    startDate: "2025-09-01",
    status: "Active",
  },
  {
    id: 2,
    employee: "Babajide Lawson",
    monthlyAvc: "₦80,000",
    startDate: "2026-01-01",
    status: "Active",
  },
  {
    id: 3,
    employee: "Amara Okafor",
    monthlyAvc: "₦30,000",
    startDate: "2025-06-01",
    status: "Paused",
  },
];

export default function AvcContributions() {
  const [records, setRecords] = useState<AvcRecord[]>(initialAvcRecords);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    employee: "",
    monthlyAvc: "",
    startDate: "",
  });

  /* ==========================================================
     PAUSE / RESUME AVC
  ========================================================== */

  const handleToggleStatus = (id: number) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status: record.status === "Active" ? "Paused" : "Active",
            }
          : record,
      ),
    );
  };

  /* ==========================================================
     FORM INPUT
  ========================================================== */

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ==========================================================
     ADD AVC
  ========================================================== */

  const handleAddAvc = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.employee || !formData.monthlyAvc || !formData.startDate) {
      return;
    }

    const newRecord: AvcRecord = {
      id: Date.now(),
      employee: formData.employee,
      monthlyAvc: `₦${Number(formData.monthlyAvc).toLocaleString()}`,
      startDate: formData.startDate,
      status: "Active",
    };

    setRecords((current) => [...current, newRecord]);

    setFormData({
      employee: "",
      monthlyAvc: "",
      startDate: "",
    });

    setIsModalOpen(false);
  };

  return (
    <section className="mt-5 w-full">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="
            inline-flex
            h-9
            items-center
            gap-2
            rounded
            bg-[#16823B]
            px-4
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#126D31]
            focus:outline-none
            focus:ring-2
            focus:ring-[#16823B]/20
          "
        >
          <Plus size={15} strokeWidth={2} />
          Add AVC
        </button>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div
        className="
          w-full
          overflow-hidden
          rounded
          border
          border-[#E1E6EB]
          bg-white
        "
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            {/* TABLE HEADER */}

            <thead>
              <tr className="h-9 border-b border-dashed border-[#E1E6EB]">
                <th className="w-[30%] px-3 text-left text-sm font-medium text-[#718096]">
                  Employee
                </th>

                <th className="w-[19%] px-3 text-left text-sm font-medium text-[#718096]">
                  Monthly AVC
                </th>

                <th className="w-[19%] px-3 text-left text-sm font-medium text-[#718096]">
                  Start Date
                </th>

                <th className="w-[17%] px-3 text-left text-sm font-medium text-[#718096]">
                  Status
                </th>

                <th className="w-[15%] px-3 text-left text-sm font-medium text-[#718096]">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {records.map((record, index) => (
                <AvcRow
                  key={record.id}
                  record={record}
                  isEven={index % 2 === 1}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          ADD AVC MODAL
      ====================================================== */}

      {isModalOpen && (
        <AddAvcModal
          formData={formData}
          onChange={handleChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddAvc}
        />
      )}
    </section>
  );
}

/* ==========================================================
   AVC ROW
========================================================== */

type AvcRowProps = {
  record: AvcRecord;
  isEven: boolean;
  onToggleStatus: (id: number) => void;
};

function AvcRow({ record, isEven, onToggleStatus }: AvcRowProps) {
  const isActive = record.status === "Active";

  return (
    <tr
      className={`
        h-[47px]
        border-b
        border-[#EDF0F3]
        last:border-b-0
        ${isEven ? "bg-[#F3F4F8]" : "bg-white"}
      `}
    >
      {/* EMPLOYEE */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-semibold text-[#263447]">
          {record.employee}
        </span>
      </td>

      {/* MONTHLY AVC */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-bold text-[#16823B]">
          {record.monthlyAvc}
        </span>
      </td>

      {/* START DATE */}

      <td className="px-3">
        <span className="whitespace-nowrap text-sm font-medium text-[#617287]">
          {record.startDate}
        </span>
      </td>

      {/* STATUS */}

      <td className="px-3">
        <AvcStatusBadge status={record.status} />
      </td>

      {/* ACTION */}

      <td className="px-3">
        <button
          type="button"
          onClick={() => onToggleStatus(record.id)}
          className="
            inline-flex
            h-7
            items-center
            justify-center
            rounded
            bg-[#F1F4F7]
            px-3
            text-xs
            font-semibold
            text-[#64748B]
            transition
            hover:bg-[#E5E9EE]
            hover:text-[#263447]
          "
        >
          {isActive ? "Pause" : "Resume"}
        </button>
      </td>
    </tr>
  );
}

/* ==========================================================
   STATUS BADGE
========================================================== */

function AvcStatusBadge({ status }: { status: AvcStatus }) {
  const isActive = status === "Active";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ${
          isActive
            ? "bg-[#D9F3DF] text-[#25803D]"
            : "bg-[#FFF1C9] text-[#927000]"
        }
      `}
    >
      {status}
    </span>
  );
}

/* ==========================================================
   ADD AVC MODAL
========================================================== */

type AddAvcModalProps = {
  formData: {
    employee: string;
    monthlyAvc: string;
    startDate: string;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function AddAvcModal({
  formData,
  onChange,
  onClose,
  onSubmit,
}: AddAvcModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-4 mt-4">
        {/* MODAL HEADER */}

        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[#263447]">
              Add Voluntary Contribution
            </h2>

            <p className="mt-1 text-xs font-medium text-[#8290A3]">
              Add a voluntary pension contribution.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded
              p-1.5
              text-[#718096]
              transition
              hover:bg-[#F3F4F8]
              hover:text-[#263447]
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={onSubmit} className="space-y-4 px-5 py-5">
          {/* EMPLOYEE */}

          <div>
            <label
              htmlFor="employee"
              className="mb-1.5 block text-sm font-semibold text-[#344054]"
            >
              Employee *
            </label>

            <input
              id="employee"
              name="employee"
              type="text"
              value={formData.employee}
              onChange={onChange}
              placeholder="Enter employee name"
              className="
                h-10
                w-full
                rounded
                border
                border-[#DCE2E8]
                px-3
                text-sm
                font-medium
                text-[#344054]
                outline-none
                placeholder:text-[#98A2B3]
                focus:border-[#16823B]
                focus:ring-1
                focus:ring-[#16823B]/10
              "
            />
          </div>

          {/* MONTHLY AVC */}

          <div>
            <label
              htmlFor="monthlyAvc"
              className="mb-1.5 block text-sm font-semibold text-[#344054]"
            >
              Monthly AVC Amount (₦) *
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#718096]">
                ₦
              </span>

              <input
                id="monthlyAvc"
                name="monthlyAvc"
                type="number"
                min="0"
                value={formData.monthlyAvc}
                onChange={onChange}
                placeholder="0"
                className="
                  h-10
                  w-full
                  rounded
                  border
                  border-[#DCE2E8]
                  pl-7
                  pr-3
                  text-sm
                  font-medium
                  text-[#344054]
                  outline-none
                  placeholder:text-[#98A2B3]
                  focus:border-[#16823B]
                  focus:ring-1
                  focus:ring-[#16823B]/10
                "
              />
            </div>
          </div>

          {/* START DATE */}

          <div>
            <label
              htmlFor="startDate"
              className="mb-1.5 block text-sm font-semibold text-[#344054]"
            >
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={onChange}
              className="
                h-10
                w-full
                rounded
                border
                border-[#DCE2E8]
                px-3
                text-sm
                font-medium
                text-[#344054]
                outline-none
                focus:border-[#16823B]
                focus:ring-1
                focus:ring-[#16823B]/10
              "
            />
          </div>

          {/* BUTTONS */}

          <div className="flex justify-between items-center gap-1 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                h-10
                rounded
                border
                border-[#DCE2E8]
                bg-white
                w-full
                text-sm
                font-semibold
                text-[#64748B]
                transition
                hover:bg-[#F8FAFC]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                h-10
                rounded
                bg-[#16823B]
                w-full
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#126D31]
              "
            >
              Add AVC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
