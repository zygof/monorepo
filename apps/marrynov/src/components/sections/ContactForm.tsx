"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAnalytics } from "@marrynov/monitoring/analytics";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const { track } = useAnalytics();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    budget: "",
    projectTypes: [] as string[],
    description: "",
    privacy: false,
  });

  const [emailError, setEmailError] = useState("");

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isFormValid =
    formData.email.trim() !== "" && isValidEmail(formData.email) && formData.privacy;

  const handleEmailBlur = () => {
    if (formData.email && !isValidEmail(formData.email)) {
      setEmailError("Adresse e-mail invalide.");
    } else {
      setEmailError("");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleProjectTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter((t) => t !== type)
        : [...prev.projectTypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    // Description required only if "other" is selected
    if (formData.projectTypes.includes("other") && !formData.description) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez décrire votre projet dans la description.",
      });
      return;
    }

    if (!formData.privacy) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez accepter la politique de confidentialité.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        track("form_submit", {
          form_id: "contact",
          form_name: "Formulaire de contact / devis",
        });
        setSubmitStatus({
          type: "success",
          message: "Message envoyé avec succès ! Je vous recontacte sous 24h.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          budget: "",
          projectTypes: [],
          description: "",
          privacy: false,
        });
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Une erreur est survenue. Réessayez ou contactez-moi directement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-white rounded-2xl p-5 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Image
          src={"/icons/edit.svg"}
          alt=""
          aria-hidden="true"
          width={18}
          height={18}
          className="h-4.5 w-4.5"
        />
        <h2 className="text-dark text-lg font-semibold">{t("sectionTitle")}</h2>
      </div>

      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className={`mb-5 rounded-lg p-4 ${
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-dark mb-1.5 block text-sm font-medium">
              {t("name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("namePlaceholder")}
              required
              suppressHydrationWarning
              className="border-border bg-bg-white text-dark placeholder:text-light-muted focus:ring-primary/30 focus:border-primary w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-dark mb-1.5 block text-sm font-medium">
              {t("email")} <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              placeholder={t("emailPlaceholder")}
              required
              suppressHydrationWarning
              className={`text-dark placeholder:text-light-muted focus:ring-primary/30 focus:border-primary w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
                emailError ? "border-red-400 bg-red-50" : "border-border bg-bg-white"
              }`}
            />
            {emailError && <p className="mt-1.5 text-xs text-red-500">{emailError}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-dark mb-1.5 block text-sm font-medium">
              {t("phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("phonePlaceholder")}
              suppressHydrationWarning
              className="border-border bg-bg-white text-dark placeholder:text-light-muted focus:ring-primary/30 focus:border-primary w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
            />
          </div>
          <div className="hidden">
            <label className="text-dark mb-1.5 block text-sm font-medium">
              {t("serviceType")}
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="border-border bg-bg-white text-dark focus:ring-primary/30 focus:border-primary w-full appearance-none rounded-lg border bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2000-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem] bg-position-[right_0.75rem_center] bg-no-repeat px-4 py-3 pr-10 transition-colors focus:ring-2 focus:outline-none"
            >
              <option value="">{t("serviceTypePlaceholder")}</option>
              <option value="standard">Pack Standard</option>
              <option value="pro">Pack Pro</option>
              <option value="expert">Pack Expert</option>
              <option value="automation">Automatisation Métier</option>
              <option value="custom">Développement Sur Mesure</option>
            </select>
          </div>
          <div>
            <label className="text-dark mb-1.5 block text-sm font-medium">
              {t("budget")}
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="border-border bg-bg-white text-dark focus:ring-primary/30 focus:border-primary w-full appearance-none rounded-lg border bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2000-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem] bg-position-[right_0.75rem_center] bg-no-repeat px-4 py-3 pr-10 transition-colors focus:ring-2 focus:outline-none"
            >
              <option value="">{t("budgetPlaceholder")}</option>
              <option value="0-2500">0€ - 2 500€</option>
              <option value="2500-5000">2 500€ - 5 000€</option>
              <option value="5000-12000">5 000€ - 12 000€</option>
              <option value="12000+">12 000€+</option>
            </select>
          </div>
        </div>

        {/* Project Types Checkboxes */}
        <div>
          <label className="text-dark mb-1.5 block text-sm font-medium">
            {t("projectType")}
          </label>
          <p className="text-muted mb-3 text-xs">{t("projectTypeSubtitle")}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "showcase",
              "ecommerce",
              "webapp",
              "mobile",
              "automation",
              "dashboard",
              "redesign",
              "maintenance",
              "other",
            ].map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                  formData.projectTypes.includes(type)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-bg-white hover:border-primary"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.projectTypes.includes(type)}
                  onChange={() => handleProjectTypeChange(type)}
                  className="text-primary border-primary focus:ring-primary accent-primary h-4 w-4 rounded"
                />
                <span
                  className={`text-sm font-medium ${
                    formData.projectTypes.includes(type) ? "text-primary" : "text-dark"
                  }`}
                >
                  {t(`projectTypes.${type}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-dark mb-1.5 block text-sm font-medium">
            {t("description")}
            {formData.projectTypes.includes("other") && (
              <span className="text-accent ml-1">*</span>
            )}
          </label>
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={
              formData.projectTypes.includes("other")
                ? "Décrivez votre projet en détail : objectifs, cible, fonctionnalités souhaitées..."
                : "Parlez-moi de vos besoins spécifiques, de vos attentes, de votre vision..."
            }
            className="border-border bg-bg-white text-dark placeholder:text-light-muted focus:ring-primary/30 focus:border-primary w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="privacy"
            checked={formData.privacy}
            onChange={handleChange}
            required
            className="text-primary border-primary focus:ring-primary accent-primary mt-1 h-4 w-4 rounded"
          />
          <span className="text-body text-sm">
            J&apos;accepte que mes données personnelles soient utilisées pour traiter ma
            demande et me recontacter. Aucun démarchage, aucune revente.{" "}
            <Link
              href="/politique-confidentialite"
              className="text-primary hover:underline"
              target="_blank"
            >
              Politique de confidentialité
            </Link>
          </span>
        </label>
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="bg-accent hover:bg-accent-hover w-full cursor-pointer rounded-lg py-3.5 font-semibold text-white transition-colors hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Envoi en cours..." : t("submit")}
        </button>
      </form>
    </div>
  );
}
