import sys
import json
import traceback
from recognizer import FormulaRecognizer

recognizer = FormulaRecognizer()


def handle_request(request: dict) -> dict:
    method = request.get("method")
    params = request.get("params", {})
    req_id = request.get("id")

    if method == "ping":
        return {"jsonrpc": "2.0", "result": "pong", "id": req_id}
    elif method == "recognize":
        image_b64 = params.get("image", "")
        if not image_b64:
            return {"jsonrpc": "2.0", "error": {"code": -2, "message": "No image data"}, "id": req_id}
        if len(image_b64) < 100:
            return {"jsonrpc": "2.0", "error": {"code": -2, "message": "Image too small"}, "id": req_id}
        try:
            result = recognizer.recognize(image_b64)
            return {"jsonrpc": "2.0", "result": result, "id": req_id}
        except Exception as e:
            return {"jsonrpc": "2.0", "error": {"code": -1, "message": str(e)}, "id": req_id}
    elif method == "shutdown":
        recognizer.shutdown()
        return {"jsonrpc": "2.0", "result": "ok", "id": req_id}
    else:
        return {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": req_id}


def main():
    model_loaded = False
    try:
        recognizer.load()
        model_loaded = True
    except Exception as e:
        err = {"jsonrpc": "2.0", "method": "ready", "params": {"error": str(e)}}
        sys.stdout.write(json.dumps(err) + "\n")
        sys.stdout.flush()

    if model_loaded:
        ready = {"jsonrpc": "2.0", "method": "ready", "params": {}}
        sys.stdout.write(json.dumps(ready) + "\n")
        sys.stdout.flush()

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
            response = handle_request(request)
            sys.stdout.write(json.dumps(response) + "\n")
            sys.stdout.flush()
        except json.JSONDecodeError:
            error = {"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}, "id": None}
            sys.stdout.write(json.dumps(error) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    main()
