import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ErrorView } from "../../components/ui/ErrorView";
import { SampleModalPage } from "../../pages/SampleModal";
import { FROM_VALUES } from "../../types/from";
import { SERVICE_TYPE_VALUES } from "../../types/serviceType";

export const Route = createFileRoute("/sampleModal/")({
  validateSearch: z.object({
    from: z.enum(FROM_VALUES),
    serviceType: z.enum(SERVICE_TYPE_VALUES),
  }),
  errorComponent: ErrorView,
  component: function SampleModalQueryRoute() {
    const { from, serviceType } = Route.useSearch();
    return <SampleModalPage from={from} serviceType={serviceType} />;
  },
});
