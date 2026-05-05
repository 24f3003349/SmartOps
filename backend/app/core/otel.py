from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.sdk.resources import Resource
def setup_otel(service_name: str):
    resource = Resource.create(attributes={
        "service.name": service_name
    })
    
    provider = TracerProvider(resource=resource)
    
    # Export to console for local dev/debugging
    processor = BatchSpanProcessor(ConsoleSpanExporter())
    provider.add_span_processor(processor)
    
    trace.set_tracer_provider(provider)
