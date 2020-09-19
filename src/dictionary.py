#!/usr/bin/env python3

"""
Look up words in macOS dictionary. (https://github.com/alichtman/scripts/blob/master/dictionary.py)

Modified from:

http://macscripter.net/viewtopic.php?id=26675
http://apple.stackexchange.com/questions/90040/look-up-a-word-in-dictionary-app-in-terminal
https://gist.github.com/lambdamusic/bdd56b25a5f547599f7f
"""


import sys

try:
    from DictionaryServices import DCSCopyTextDefinition
except ImportError:
    print("ERROR: Missing lib. $ pip install pyobjc-framework-CoreServices")
    sys.exit()

try:
    from colorama import Fore, Style
except ImportError:
    print("ERROR: Missing lib. $ pip install colorama")


def main():
    """
    define.py

    Access the default OSX dictionary
    """
    try:
        searchword = sys.argv[1]
    except IndexError:
        errmsg = 'You did not enter any terms to look up in the Dictionary.'
        print(errmsg)
        sys.exit()
    wordrange = (0, len(searchword))
    dictresult = DCSCopyTextDefinition(None, searchword, wordrange)
    if not dictresult:
        errmsg = "'%result' not found in Dictionary." % (searchword)
        print(errmsg.encode('utf-8'))
    else:
        print(dictresult)


def colorize(string, style=None):
    """
    Returns a colored string encoded as a sequence of bytes.
    """
    string = str(string)
    if style == "bold":
        string = Style.BRIGHT + string + Style.RESET_ALL
    elif style == "red":
        string = Fore.RED + string + Style.RESET_ALL
    return bytes(string, encoding="utf-8")


if __name__ == '__main__':
    main()