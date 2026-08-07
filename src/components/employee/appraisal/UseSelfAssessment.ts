"use client";

import { useState } from "react";

export function useSelfAssessment() {
  const [loading, setLoading] = useState(false);

  const saveDraft = async () => {
    try {
      setLoading(true);

      // await api.saveDraft()

      console.log("Draft saved");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    try {
      setLoading(true);

      // await api.submit()

      console.log("Submitted");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveDraft,
    submit,
  };
}
